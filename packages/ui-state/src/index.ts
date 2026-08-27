import React from "react";

type AvailableStatus =
  | "pending"
  | "not-found"
  | "error"
  | "empty-search"
  | "empty"
  | "default"
  | (string & {}); // Allows extra status

// oxlint-disable-next-line typescript/no-explicit-any
type ExplicitAny = any;

type UiStateError<Message extends string> = null | {
  __error__: Message;
};

type NonExhaustiveError<Message extends string = ""> = UiStateError<Message>;
type ExhaustiveError<Message extends string = ""> = UiStateError<Message>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type DataOf<
  T extends { __status: string },
  S extends T["__status"],
> = T extends { __status: S } ? Omit<T, "__status"> : never;

type ExcludeStatus<
  T extends { __status: string },
  S extends string,
> = T extends { __status: S } ? never : T;

type SetResult<S extends string, SData> = S extends unknown
  ? [SData] extends [undefined]
    ? { __status: S }
    : Prettify<{ __status: S } & SData>
  : never;

type GetUiStateSet = <
  S extends AvailableStatus,
  SData extends Record<string, unknown> | undefined = undefined,
>(
  status: S,
  data?: SData,
) => SetResult<S, SData>;

type MatchResult<Rest extends { __status: string }> = {
  nonExhaustive: () => React.ReactNode;
} & ([Rest] extends [never]
  ? {
      exhaustive: () => React.ReactNode;
      match: (
        error: ExhaustiveError<"All status are already matched">,
      ) => ExhaustiveError<"All status are already matched">;
    }
  : {
      exhaustive: ExhaustiveError<`${Rest["__status"]} is missing to use \`exhaustive()\``>;
      match: UiState<Rest>["match"];
    });

type UiState<T extends { __status: AvailableStatus }> = {
  is: <S extends T["__status"]>(
    status: S,
  ) => this is UiState<Extract<T, { __status: S }>>;
  state: T;
  when: <S extends T["__status"], R = React.ReactNode>(
    status: S | Array<S>,
    handler: (data: DataOf<T, S>) => R,
  ) => R | null;
  exhaustive: () => ExhaustiveError<`\`exhaustive()\` should be use after \`match\``>;
  nonExhaustive: () => NonExhaustiveError<`\`nonExhaustive()\` should be use after \`match\``>;
  match: <S extends T["__status"]>(
    status: S | Array<S>,
    handler: (
      data: DataOf<T, S>,
    ) => React.ReactNode | ((...args: ExplicitAny[]) => React.ReactNode),
    __matched?: boolean,
    render?: () =>
      | React.ReactNode
      | ((...args: ExplicitAny[]) => React.ReactNode),
  ) => MatchResult<ExcludeStatus<T, S>>;
};

export const getUiState = <T extends { __status: AvailableStatus }>(
  getState: (set: GetUiStateSet) => T,
): UiState<T> => {
  const state = Object.freeze(
    getState(((status, data = {} as ExplicitAny) => {
      return {
        __status: status,
        ...data,
      };
    }) as GetUiStateSet),
  );

  const isMatching = (status: T["__status"]): boolean =>
    status === state.__status;

  const isMatchingArray = (status: Array<T["__status"]>): boolean =>
    status.includes(state.__status);

  const uiState: UiState<T> = {
    state,
    is: ((status: T["__status"]) => {
      return state.__status === status;
    }) as UiState<T>["is"],
    when: (status, handler) => {
      if (
        typeof status === "string"
          ? isMatching(status)
          : isMatchingArray(status)
      ) {
        return handler(state as ExplicitAny);
      }
      return null;
    },
    nonExhaustive: () => null,
    exhaustive: () => null,
    match: (status, handler, __matched = false, render = () => null) => {
      if (
        !__matched &&
        (typeof status === "string"
          ? isMatching(status)
          : isMatchingArray(status))
      ) {
        return {
          exhaustive: () => handler(state as ExplicitAny) as React.ReactNode,
          nonExhaustive: () =>
            handler(state as ExplicitAny) as React.ReactNode,
          match: (nextStatus: ExplicitAny, nextHandler: ExplicitAny) =>
            uiState.match(nextStatus, nextHandler, true, () =>
              handler(uiState.state as ExplicitAny),
            ),
        } as ExplicitAny;
      }

      return {
        exhaustive: () => render() as React.ReactNode,
        nonExhaustive: () => render() as React.ReactNode,
        match: (nextStatus: T["__status"], nextHandler: ExplicitAny) =>
          uiState.match(nextStatus, nextHandler, __matched, render),
      } as ExplicitAny;
    },
  };

  return uiState;
};

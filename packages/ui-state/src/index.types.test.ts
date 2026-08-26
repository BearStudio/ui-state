import { describe, it, expectTypeOf, expect } from "vitest";
import type { ReactNode } from "react";
import { getUiState } from "./index.js";

describe("getUiState types", () => {
  const cond = true as boolean;
  const ui = getUiState((set) => {
    if (cond) {
      return set("error", { message: "fail" });
    }
    return set("default", { title: "ok" });
  });

  it("state is a discriminated union", () => {
    expectTypeOf(ui.state).toEqualTypeOf<
      | { __status: "error"; message: string }
      | { __status: "default"; title: string }
    >();
  });

  it("is() narrows state", () => {
    if (ui.is("error")) {
      expectTypeOf(ui.state.message).toEqualTypeOf<string>();
      // @ts-expect-error title is not on error
      expectTypeOf(ui.state.title).toEqualTypeOf<string>();
    }
  });

  it("__status check narrows state", () => {
    if (ui.state.__status === "default") {
      expectTypeOf(ui.state.title).toEqualTypeOf<string>();
      // @ts-expect-error message is not on default
      expectTypeOf(ui.state.message).toEqualTypeOf<string>();
    }
  });

  it("exhaustive() is not callable while statuses remain", () => {
    const partial = ui.match("error", () => null);
    expectTypeOf(partial.exhaustive).not.toEqualTypeOf<() => ReactNode>();
    // @ts-expect-error default is missing
    partial.exhaustive();
  });

  it("rejects exhaustive() before any match", () => {
    expectTypeOf(ui.exhaustive).not.toEqualTypeOf<() => ReactNode>();
    // @ts-expect-error exhaustive requires a complete match chain
    ui.exhaustive();
  });

  it("exhaustive() is callable when complete", () => {
    const done = ui.match("error", () => "e").match("default", () => "d");
    expectTypeOf(done.exhaustive).toEqualTypeOf<() => ReactNode>();
    expect(done.exhaustive()).toBe("e");
  });

  it("match data is the variant payload", () => {
    ui.match("error", (data) => {
      expectTypeOf(data.message).toEqualTypeOf<string>();
      // @ts-expect-error title is not on error payload
      return data.title;
    });
  });

  it("is() rejects a status outside the union", () => {
    // @ts-expect-error pending is not in the union
    expect(ui.is("pending")).toBe(false);
  });

  it("match() rejects a status already matched", () => {
    const rest = ui.match("error", () => null);
    expectTypeOf(rest.match).toBeCallableWith("default", () => null);
    // @ts-expect-error error already matched
    rest.match("error", () => null);
  });
});

describe("getUiState from set() with a status union", () => {
  const status = "test" as "test" | "default";
  const ui = getUiState((set) => set(status));

  it("splits set(status) into a discriminated state", () => {
    expectTypeOf(ui.state).toEqualTypeOf<
      { __status: "test" } | { __status: "default" }
    >();
  });

  it("exhaustive() is callable when the union is covered", () => {
    const done = ui.match("test", () => "t").match("default", () => "d");
    expectTypeOf(done.exhaustive).toEqualTypeOf<() => ReactNode>();
    expect(done.exhaustive()).toBe("t");
  });
});

describe("getUiState empty payload vs data payload", () => {
  const cond = true as boolean;
  const book = { title: "Dune" };
  const ui = getUiState((set) => {
    if (cond) {
      return set("pending");
    }
    return set("default", { book });
  });

  it("pending state has no data keys", () => {
    if (ui.is("pending")) {
      type Pending = typeof ui.state;
      type HasBook = "book" extends keyof Pending ? true : false;
      expectTypeOf<HasBook>().toEqualTypeOf<false>();
      expectTypeOf(ui.state).toEqualTypeOf<{ __status: "pending" }>();
      // @ts-expect-error book is not on pending
      expectTypeOf(ui.state.book).toEqualTypeOf(book);
    }
  });

  it("shared match does not expose keys missing from a variant", () => {
    ui.match(["pending", "default"], (data) => {
      type HasBook = "book" extends keyof typeof data ? true : false;
      expectTypeOf<HasBook>().toEqualTypeOf<false>();
      // @ts-expect-error book is not on pending
      return data.book;
    });
  });
});

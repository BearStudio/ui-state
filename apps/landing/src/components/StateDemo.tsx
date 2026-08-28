import { useMemo, useState } from "react";
import { getUiState } from "@bearstudio/ui-state";
import { BearMascot } from "./BearMascot";

type Bear = { name: string };

type QueryError = {
  code: "FORBIDDEN" | "UNKNOWN";
};

type Query = {
  isPending: boolean;
  isError: boolean;
  error: QueryError | undefined;
  data: Bear[] | undefined;
};

type QueryStatus = "pending" | "error" | "forbidden" | "success" | "empty";

type QueryStatusOption = {
  id: QueryStatus;
  label: string;
};

const BEARS: Bear[] = [{ name: "Bruno" }, { name: "Nala" }, { name: "Koda" }];

const QUERY_STATUS_OPTIONS = [
  { id: "pending", label: "pending" },
  { id: "error", label: "error" },
  { id: "forbidden", label: "forbidden" },
  { id: "success", label: "success" },
  { id: "empty", label: "empty" },
] as const satisfies ReadonlyArray<QueryStatusOption>;

function getQuery(status: QueryStatus): Query {
  switch (status) {
    case "pending":
      return {
        isPending: true,
        isError: false,
        error: undefined,
        data: undefined,
      };
    case "forbidden":
      return {
        isPending: false,
        isError: true,
        error: { code: "FORBIDDEN" },
        data: undefined,
      };
    case "error":
      return {
        isPending: false,
        isError: true,
        error: { code: "UNKNOWN" },
        data: undefined,
      };
    case "empty":
      return {
        isPending: false,
        isError: false,
        error: undefined,
        data: [],
      };
    case "success":
      return {
        isPending: false,
        isError: false,
        error: undefined,
        data: BEARS,
      };
    default: {
      const exhaustiveCheck: never = status;
      throw new Error("Unhandled query status", { cause: exhaustiveCheck });
    }
  }
}

export function StateDemo() {
  const [queryStatus, setQueryStatus] = useState<QueryStatus>("success");
  const [search, setSearch] = useState("");

  const ui = useMemo(() => {
    const query = getQuery(queryStatus);
    const term = search.trim();
    const bears = (query.data ?? []).filter((bear) =>
      bear.name.toLowerCase().includes(term.toLowerCase()),
    );

    return getUiState((set) => {
      if (query.isPending) return set("pending");
      if (query.isError && query.error?.code === "FORBIDDEN")
        return set("forbidden");
      if (query.isError) return set("error");
      if (!bears.length && term) return set("empty-search", { search: term });
      if (!bears.length) return set("empty");
      return set("default", { bears });
    });
  }, [queryStatus, search]);

  return (
    <div className="min-w-0">
      <div className="flex sm:flex-row flex-col gap-4">
        <label className="flex flex-col">
          <p
            className="font-mono text-xs text-ink-soft"
            id="query-status-label"
          >
            Query
          </p>
          <div
            role="group"
            aria-labelledby="query-status-label"
            className="mt-1.5 flex flex-wrap gap-1.5"
          >
            {QUERY_STATUS_OPTIONS.map((option) => {
              const selected = option.id === queryStatus;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  className={`h-8 cursor-pointer rounded-md border px-2.5 font-mono text-xs ${
                    selected
                      ? "border-accent-ink bg-accent text-accent-ink"
                      : "border-line bg-paper text-ink-soft hover:border-ink-soft"
                  }`}
                  onClick={() => {
                    setQueryStatus(option.id);
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </label>
        <label className="min-w-0 flex flex-col">
          <span className="font-mono text-xs text-ink-soft">Search</span>
          <input
            type="search"
            className="mt-1.5 h-8 w-full rounded-md border border-line bg-paper px-2.5 font-mono text-xs sm:max-w-xs"
            value={search}
            placeholder="Bruno"
            onChange={(event) => {
              setSearch(event.currentTarget.value);
            }}
          />
        </label>
      </div>

      <div
        aria-busy={ui.is("pending")}
        aria-live="polite"
        className="mt-6 flex min-h-48 w-full min-w-0 flex-col items-center justify-center gap-3 rounded-lg border border-line bg-paper-2 px-4 py-8 text-center"
      >
        <p className="font-mono text-sm text-ink">
          {ui
            .match("pending", () => "Bears")
            .match("forbidden", () => "Can't enter the den")
            .match("error", () => "Couldn't load bears")
            .match("empty", () => "No bears yet")
            .match(
              "empty-search",
              ({ search: term }) => `No results for ${term}`,
            )
            .match("default", ({ bears }) =>
              bears.length === 1 ? "1 bear" : `${bears.length} bears`,
            )
            .exhaustive()}
        </p>
        {ui
          .match("pending", () => (
            <BearMascot mood="loading" className="size-28 sm:size-32" />
          ))
          .match("forbidden", () => (
            <BearMascot mood="lost" className="size-28 sm:size-32" />
          ))
          .match("error", () => (
            <BearMascot mood="sad" className="size-28 sm:size-32" />
          ))
          .match("empty", () => (
            <BearMascot mood="empty" className="size-28 sm:size-32" />
          ))
          .match("empty-search", () => (
            <BearMascot mood="hungry" className="size-28 sm:size-32" />
          ))
          .match("default", () => (
            <BearMascot mood="happy" className="size-28 sm:size-32" />
          ))
          .exhaustive()}
        <p className="max-w-48 font-mono text-xs text-ink-soft">
          {ui
            .match("pending", () => "Loading…")
            .match("forbidden", () => "Forbidden")
            .match("error", () => "Request failed")
            .match("empty", () => "Nothing in the den")
            .match("empty-search", ({ search: term }) => `"${term}"`)
            .match("default", ({ bears }) =>
              bears.map((bear) => bear.name).join(" · "),
            )
            .exhaustive()}
        </p>
      </div>
    </div>
  );
}

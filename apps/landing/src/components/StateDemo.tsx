import { useMemo, useState } from "react";
import { getUiState } from "@bearstudio/ui-state";

type DemoStatus =
  | "pending"
  | "error"
  | "empty"
  | "not-found"
  | "show-input"
  | "success";

type Book = {
  title: string;
  author: string;
};

const DEMO_BOOK: Book = {
  title: "The Left Hand of Darkness",
  author: "Ursula K. Le Guin",
};

const STATUSES: ReadonlyArray<{ id: DemoStatus; label: string }> = [
  { id: "pending", label: "pending" },
  { id: "error", label: "error" },
  { id: "empty", label: "empty" },
  { id: "not-found", label: "not-found" },
  { id: "show-input", label: "show-input" },
  { id: "success", label: "default" },
];

const ITEM_PX = 44;
const WINDOW = 5;
const PAD = 2;

function isDemoStatus(value: string): value is DemoStatus {
  return STATUSES.some((item) => item.id === value);
}

export function StateDemo() {
  const [status, setStatus] = useState<DemoStatus>("success");
  const selectedIndex = STATUSES.findIndex((item) => item.id === status);

  const ui = useMemo(
    () =>
      getUiState((set) => {
        if (status === "pending") {
          return set("pending");
        }
        if (status === "error") {
          return set("error");
        }
        if (status === "empty") {
          return set("empty");
        }
        if (status === "not-found") {
          return set("not-found");
        }
        if (status === "show-input") {
          return set("show-input");
        }
        return set("default", { book: DEMO_BOOK });
      }),
    [status],
  );

  function step(delta: number) {
    const next = Math.min(
      STATUSES.length - 1,
      Math.max(0, selectedIndex + delta),
    );
    const item = STATUSES[next];
    if (item) {
      setStatus(item.id);
    }
  }

  const view = ui
    .match("pending", () => (
      <article aria-busy="true" aria-live="polite">
        <p className="font-mono text-xs text-ink-soft">pending</p>
        <div className="mt-3 h-7 w-2/3 max-w-xs rounded-lg bg-paper-2" />
        <div className="mt-2 h-5 w-1/3 max-w-[10rem] rounded-lg bg-paper-2" />
      </article>
    ))
    .match("error", () => (
      <p className="text-err">Could not load the book.</p>
    ))
    .match("empty", () => (
      <p className="text-ink-soft">No books on this shelf.</p>
    ))
    .match("not-found", () => (
      <p className="text-ink-soft">That book is not in the catalogue.</p>
    ))
    .match("show-input", () => (
      <label className="block max-w-xs">
        <span className="font-mono text-xs text-ink-soft">search</span>
        <input
          className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm"
          placeholder="Search the catalogue"
        />
      </label>
    ))
    .match("default", ({ book }) => (
      <article>
        <h3 className="text-xl font-medium">{book.title}</h3>
        <p className="mt-1 text-ink-soft">{book.author}</p>
      </article>
    ))
    .exhaustive();

  return (
    <div className="grid items-center gap-8 sm:grid-cols-2">
      <label className="hidden motion-reduce:block">
        <span className="font-mono text-xs text-ink-soft">status</span>
        <select
          className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper px-3 font-mono text-sm"
          value={status}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (isDemoStatus(value)) {
              setStatus(value);
            }
          }}
        >
          {STATUSES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <div
        className="relative motion-reduce:hidden"
        style={{ height: WINDOW * ITEM_PX }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 rounded-lg bg-accent"
          style={{ top: PAD * ITEM_PX, height: ITEM_PX }}
        />
        <div
          role="listbox"
          aria-label="UI status"
          tabIndex={0}
          className="h-full overflow-hidden"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              step(1);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              step(-1);
            }
          }}
        >
          <div
            className="relative transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{
              transform: `translateY(${(PAD - selectedIndex) * ITEM_PX}px)`,
            }}
          >
            {STATUSES.map((item) => {
              const selected = item.id === status;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={
                    selected
                      ? "flex h-11 w-full items-center px-3 font-mono text-sm text-ink"
                      : "flex h-11 w-full items-center px-3 font-mono text-sm text-ink-soft"
                  }
                  onClick={() => {
                    setStatus(item.id);
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-40">{view}</div>
    </div>
  );
}

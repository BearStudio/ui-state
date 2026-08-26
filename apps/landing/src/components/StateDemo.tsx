import { useMemo, useState } from "react";
import { getUiState } from "@bearstudio/ui-state";

type DemoStatus = "pending" | "error" | "success";

type Book = {
  title: string;
  author: string;
};

const DEMO_BOOK: Book = {
  title: "The Left Hand of Darkness",
  author: "Ursula K. Le Guin",
};

const CONTROLS: ReadonlyArray<{ id: DemoStatus; label: string }> = [
  { id: "pending", label: "pending" },
  { id: "error", label: "error" },
  { id: "success", label: "default" },
];

export function StateDemo() {
  const [status, setStatus] = useState<DemoStatus>("success");

  const ui = useMemo(
    () =>
      getUiState((set) => {
        if (status === "pending") {
          return set("pending");
        }
        if (status === "error") {
          return set("error");
        }
        return set("default", { book: DEMO_BOOK });
      }),
    [status],
  );

  const pendingHint = ui.when("pending", () => "Fetching…");

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="font-mono text-xs text-ink-soft">
          bookQuery → getUiState → match + exhaustive
          {pendingHint ? (
            <span className="ml-2 text-accent">{pendingHint}</span>
          ) : null}
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Simulated query status"
        >
          {CONTROLS.map((control) => {
            const selected = status === control.id;
            return (
              <button
                key={control.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setStatus(control.id);
                }}
                className={
                  selected
                    ? "min-h-11 rounded-md bg-ink px-3 font-mono text-sm text-paper"
                    : "min-h-11 rounded-md border border-line bg-paper-2 px-3 font-mono text-sm text-ink"
                }
              >
                {control.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="min-h-40 p-5">
        {ui
          .match("pending", () => (
            <div className="flex items-center gap-3 text-ink-soft">
              <span
                className="inline-block size-4 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none"
                aria-hidden="true"
              />
              <p>Loading the book…</p>
            </div>
          ))
          .match("error", () => (
            <p className="text-err">Could not load the book.</p>
          ))
          .match("default", ({ book }) => (
            <article>
              <p className="font-mono text-xs tracking-wide text-ok uppercase">
                default
              </p>
              <h3 className="mt-2 text-xl font-medium">{book.title}</h3>
              <p className="mt-1 text-ink-soft">{book.author}</p>
            </article>
          ))
          .exhaustive()}
      </div>
    </div>
  );
}

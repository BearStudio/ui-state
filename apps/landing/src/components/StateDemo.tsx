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

  const pendingLabel = ui.when("pending", () => "Fetching the book");

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper">
      <div
        className="flex flex-wrap gap-2 p-3"
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
                  ? "min-h-11 rounded-lg bg-ink px-3 font-mono text-sm text-paper"
                  : "min-h-11 rounded-lg border border-line bg-paper px-3 font-mono text-sm text-ink"
              }
            >
              {control.label}
            </button>
          );
        })}
      </div>
      <div className="min-h-[4.75rem] border-t border-line p-5">
        {ui
          .match("pending", () => (
            <article className="relative" aria-busy="true" aria-live="polite">
              <div className="h-7 w-3/4 max-w-80 rounded-lg bg-paper-2" />
              <div className="mt-1 h-5 w-40 rounded-lg bg-paper-2" />
              <span
                className="absolute top-1.5 right-0 inline-block size-4 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none"
                aria-hidden="true"
              />
              {pendingLabel ? (
                <p className="sr-only">{pendingLabel}</p>
              ) : null}
            </article>
          ))
          .match("error", () => (
            <p className="text-err">Could not load the book.</p>
          ))
          .match("default", ({ book }) => (
            <article>
              <h3 className="text-xl font-medium">{book.title}</h3>
              <p className="mt-1 text-ink-soft">{book.author}</p>
            </article>
          ))
          .exhaustive()}
      </div>
    </div>
  );
}

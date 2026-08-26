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

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <p className="font-mono text-xs text-ink-soft">match + exhaustive</p>
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
                    ? "min-h-11 rounded-lg bg-ink px-3 font-mono text-sm text-paper"
                    : "min-h-11 rounded-lg border border-line bg-paper px-3 font-mono text-sm text-ink"
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
            <article aria-busy="true" aria-live="polite">
              <p className="font-mono text-xs tracking-wide text-ink-soft uppercase">
                pending
              </p>
              <div className="mt-3 h-2.5 w-3/4 rounded-lg bg-paper-2" />
              <div className="mt-2 h-2.5 w-1/2 rounded-lg bg-paper-2" />
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

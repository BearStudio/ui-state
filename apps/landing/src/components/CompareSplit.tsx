import { useCallback, useEffect, useId, useRef, useState } from "react";

const MIN_RATIO = 24;
const MAX_RATIO = 76;
const DEFAULT_RATIO = 50;
const STEP = 2;
const LARGE_STEP = 10;

type CompareSplitProps = {
  before?: React.ReactNode;
  after?: React.ReactNode;
};

export function CompareSplit({ before, after }: CompareSplitProps) {
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const [dragging, setDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const beforeId = useId();
  const afterId = useId();

  const clampRatio = useCallback((value: number) => {
    return Math.min(MAX_RATIO, Math.max(MIN_RATIO, value));
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const root = rootRef.current;
      if (!root) {
        return;
      }
      const rect = root.getBoundingClientRect();
      if (rect.width === 0) {
        return;
      }
      setRatio(clampRatio(((clientX - rect.left) / rect.width) * 100));
    },
    [clampRatio],
  );

  useEffect(() => {
    if (!dragging) {
      return () => {};
    }

    function onMove(event: PointerEvent) {
      updateFromClientX(event.clientX);
    }

    function onUp() {
      setDragging(false);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, updateFromClientX]);

  function onPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.currentTarget.focus();
    setDragging(true);
    updateFromClientX(event.clientX);
  }

  function onDoubleClick() {
    setRatio(DEFAULT_RATIO);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const step = event.shiftKey ? LARGE_STEP : STEP;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setRatio((current) => clampRatio(current - step));
        break;
      case "ArrowRight":
        event.preventDefault();
        setRatio((current) => clampRatio(current + step));
        break;
      case "Home":
        event.preventDefault();
        setRatio(MIN_RATIO);
        break;
      case "End":
        event.preventDefault();
        setRatio(MAX_RATIO);
        break;
      default:
        break;
    }
  }

  return (
    <div
      className={dragging ? "select-none" : undefined}
      style={{ "--split": `${ratio}%` } as React.CSSProperties}
    >
      <div className="mb-2 hidden grid-cols-[minmax(0,var(--split))_minmax(0,1fr)] lg:grid">
        <h3 className="font-mono text-sm text-ink-soft">Before</h3>
        <h3 className="pl-4 font-mono text-sm text-ink">After</h3>
      </div>

      <div
        ref={rootRef}
        className={`relative overflow-hidden rounded-lg border border-line lg:h-128 ${dragging ? "cursor-col-resize" : ""}`}
      >
        <div className="h-full lg:overflow-y-auto">
          <div className="grid min-h-full grid-cols-1 lg:grid-cols-[minmax(0,var(--split))_minmax(0,1fr)]">
            <div
              id={beforeId}
              className="flex min-h-0 min-w-0 flex-col bg-paper"
            >
              <h3 className="px-4 pt-3 font-mono text-sm text-ink-soft lg:hidden">
                Before
              </h3>
              {before}
            </div>
            <div id={afterId} className="flex min-h-0 min-w-0 flex-col bg-code">
              <h3 className="px-4 pt-3 font-mono text-sm text-hero-fg lg:hidden">
                After
              </h3>
              {after}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Resize before and after"
          aria-orientation="vertical"
          aria-controls={`${beforeId} ${afterId}`}
          aria-valuemin={MIN_RATIO}
          aria-valuemax={MAX_RATIO}
          aria-valuenow={Math.round(ratio)}
          className="group absolute inset-y-0 z-10 hidden w-2 -translate-x-2 cursor-col-resize touch-none items-center justify-center border-0 p-0 lg:flex"
          style={{ left: "var(--split)" }}
          onPointerDown={onPointerDown}
          onDoubleClick={onDoubleClick}
          onKeyDown={onKeyDown}
        >
          <span
            className={`h-10 w-1.5 rounded-full bg-accent `}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { getUiState } from "@bearstudio/ui-state";
import { BearMascot, type BearMood } from "./BearMascot";
import OptionWheel from "./OptionWheel";

type DemoStatus = "pending" | "error" | "empty" | "not-found" | "success";

const STATUSES: ReadonlyArray<{
  id: DemoStatus;
  label: string;
  mood: BearMood;
}> = [
  { id: "pending", label: "loading bear", mood: "loading" },
  { id: "error", label: "sad bear", mood: "sad" },
  { id: "empty", label: "empty bear", mood: "empty" },
  { id: "not-found", label: "lost bear", mood: "lost" },
  { id: "success", label: "happy bear", mood: "happy" },
];

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
        return set("default");
      }),
    [status],
  );

  return (
    <div className="min-w-0">
      <label className="hidden motion-reduce:mb-6 motion-reduce:block">
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

      <div className="flex min-w-0 items-center gap-6 sm:gap-10">
        <div className="relative h-32 w-40 shrink-0 motion-reduce:hidden sm:h-48 sm:w-48">
          <OptionWheel
            items={STATUSES.map((item) => item.label)}
            defaultSelected={selectedIndex}
            textColor="#135d71"
            activeColor="#0a2f39"
            side="left"
            fontSize={1.2}
            spacing={1.6}
            curve={0.05}
            tilt={0}
            blur={0.3}
            fade={0.2}
            smoothing={100}
            inset={0}
            loop
            draggable
            soundUrl="/sounds/click-soft.wav"
            soundVolume={0.65}
            className="font-mono focus-visible:ring-2 focus-visible:ring-accent"
            onChange={(index) => {
              const item = STATUSES[index];
              if (item) {
                setStatus(item.id);
              }
            }}
          />
        </div>
        <div
          aria-busy={ui.is("pending")}
          aria-live="polite"
          className="flex min-h-48 max-w-48 flex-1 shrink-0 items-center justify-center"
        >
          {ui
            .match("pending", () => (
              <BearMascot mood="loading" className="size-28 sm:size-32" />
            ))
            .match("error", () => (
              <BearMascot mood="sad" className="size-28 sm:size-32" />
            ))
            .match("empty", () => (
              <BearMascot mood="empty" className="size-28 sm:size-32" />
            ))
            .match("not-found", () => (
              <BearMascot mood="lost" className="size-28 sm:size-32" />
            ))
            .match("default", () => (
              <BearMascot mood="happy" className="size-28 sm:size-32" />
            ))
            .exhaustive()}
        </div>
      </div>
    </div>
  );
}

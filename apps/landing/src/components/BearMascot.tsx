type BearMood = "loading" | "sad" | "empty" | "lost" | "hungry" | "happy";

type BearMascotProps = {
  mood: BearMood;
  className?: string;
  spin?: boolean;
};

const FUR = "#0a2f39";
const BELLY = "#135d71";
const MUZZLE = "#e4eef0";
const GOLD = "#ffbf0f";
const INK = "#08242b";
const TEAR = "#67a7b6";
const TONGUE = "#c45c4a";

function HoneyPot({ filled }: { filled: boolean }) {
  return (
    <g transform="translate(64 138)">
      <path
        d="M-12-2h24l-3 18h-18z"
        fill={filled ? GOLD : MUZZLE}
        stroke={BELLY}
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
      <ellipse
        cx="0"
        cy="-2"
        rx="12"
        ry="3.6"
        fill={filled ? "#ffe38a" : BELLY}
        stroke={BELLY}
        strokeWidth="2.4"
      />
      {filled ? null : <ellipse cx="0" cy="2" rx="6" ry="2" fill={MUZZLE} />}
    </g>
  );
}

function BearFace({ mood }: { mood: BearMood }) {
  switch (mood) {
    case "loading":
      return (
        <>
          <circle cx="48" cy="52" r="7" fill={MUZZLE} />
          <circle cx="80" cy="52" r="7" fill={MUZZLE} />
          <circle cx="50" cy="53" r="3.2" fill={INK} />
          <circle cx="78" cy="51" r="3.2" fill={INK} />
          <path
            d="M56 78q8 4 16 0"
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="2.4"
          />
          <circle cx="22" cy="22" r="3" fill={GOLD} />
          <circle cx="106" cy="30" r="2.2" fill={GOLD} />
        </>
      );
    case "sad":
      return (
        <>
          <path
            d="M38 44q10 8 18 2"
            fill="none"
            stroke={GOLD}
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <path
            d="M72 46q8 8 18 0"
            fill="none"
            stroke={GOLD}
            strokeLinecap="round"
            strokeWidth="3.2"
          />
          <circle cx="48" cy="54" r="7" fill={MUZZLE} />
          <circle cx="80" cy="54" r="7" fill={MUZZLE} />
          <circle cx="48" cy="57" r="3.2" fill={INK} />
          <circle cx="80" cy="57" r="3.2" fill={INK} />
          <path
            d="M54 84q10-8 20 0"
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="2.6"
          />
          <path
            d="M38 64c0 8 6 12 6 16"
            className="origin-[41px_64px] motion-safe:animate-bounce"
            fill="none"
            stroke={TEAR}
            strokeLinecap="round"
            strokeWidth="3"
          />
          <circle
            cx="44"
            cy="82"
            r="3.2"
            className="motion-safe:animate-bounce"
            fill={TEAR}
          />
        </>
      );
    case "empty":
      return (
        <>
          <circle cx="48" cy="54" r="7.5" fill={MUZZLE} />
          <circle cx="80" cy="54" r="7.5" fill={MUZZLE} />
          <circle cx="48" cy="57" r="2.4" fill={INK} />
          <circle cx="80" cy="57" r="2.4" fill={INK} />
          <circle
            cx="64"
            cy="80"
            r="3.5"
            fill="none"
            stroke={INK}
            strokeWidth="2.2"
          />
          <HoneyPot filled={false} />
        </>
      );
    case "lost":
      return (
        <>
          <circle cx="48" cy="52" r="7" fill={MUZZLE} />
          <circle cx="80" cy="52" r="7" fill={MUZZLE} />
          <circle cx="44" cy="52" r="3.2" fill={INK} />
          <circle cx="76" cy="52" r="3.2" fill={INK} />
          <path
            d="M56 80q8 1 16-4"
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="2.4"
          />
          <g className="origin-[116px_32px] motion-safe:animate-pulse">
            <path
              d="M106 22c0-6 4.5-10 10-10s10 4 10 10c0 5-3 8-7 11l-3 3"
              fill="none"
              stroke={GOLD}
              strokeLinecap="round"
              strokeWidth="3.4"
            />
            <circle cx="116" cy="44" r="2.4" fill={GOLD} />
          </g>
        </>
      );
    case "hungry":
      return (
        <>
          <circle cx="48" cy="52" r="7" fill={MUZZLE} />
          <circle cx="80" cy="52" r="7" fill={MUZZLE} />
          <circle cx="50" cy="55" r="3.2" fill={INK} />
          <circle cx="82" cy="55" r="3.2" fill={INK} />
          <ellipse cx="64" cy="82" rx="9" ry="7" fill={INK} />
          <path d="M58 82q6 12 12 0" fill={TONGUE} />
          <path
            d="M74 88c8 5 12 2 14-3"
            fill="none"
            stroke={TEAR}
            strokeLinecap="round"
            strokeWidth="2.2"
          />
        </>
      );
    case "happy":
      return (
        <>
          <path
            d="M40 54q8-8 16 0"
            fill="none"
            stroke={MUZZLE}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M72 54q8-8 16 0"
            fill="none"
            stroke={MUZZLE}
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="42" cy="66" r="5" fill={GOLD} opacity="0.85" />
          <circle cx="86" cy="66" r="5" fill={GOLD} opacity="0.85" />
          <path
            d="M52 78q12 12 24 0"
            fill="none"
            stroke={INK}
            strokeLinecap="round"
            strokeWidth="2.8"
          />
          <path
            d="M16 40l3 7 7-2.5-7 7 2.5 7-7-2.5-7 7 2.5-7-7-2.5 7-7z"
            fill={GOLD}
          />
          <HoneyPot filled />
        </>
      );
    default: {
      const exhaustiveMood: never = mood;
      return exhaustiveMood;
    }
  }
}

export function BearMascot({ mood, className = "", spin }: BearMascotProps) {
  const shouldSpin = spin ?? mood === "loading";

  return (
    <span
      className={`inline-flex ${shouldSpin ? "motion-safe:animate-spin motion-safe:[animation-duration:1.6s]" : ""}`}
    >
      <svg
        viewBox="0 0 128 160"
        className={`overflow-visible ${className}`}
        aria-hidden="true"
      >
        <circle cx="32" cy="30" r="16" fill={FUR} />
        <circle cx="32" cy="31" r="8" fill={GOLD} />
        <circle cx="96" cy="30" r="16" fill={FUR} />
        <circle cx="96" cy="31" r="8" fill={GOLD} />
        <ellipse cx="64" cy="122" rx="30" ry="20" fill={FUR} />
        <ellipse cx="64" cy="126" rx="16" ry="10" fill={BELLY} />
        <ellipse
          cx="40"
          cy="122"
          rx="9"
          ry="12"
          fill={FUR}
          transform="rotate(-18 40 122)"
        />
        <ellipse
          cx="88"
          cy="122"
          rx="9"
          ry="12"
          fill={FUR}
          transform="rotate(18 88 122)"
        />
        <circle cx="64" cy="62" r="42" fill={FUR} />
        <ellipse cx="64" cy="74" rx="20" ry="14" fill={MUZZLE} />
        <ellipse cx="64" cy="68" rx="7" ry="5" fill={INK} />
        <path
          d="M64 73v7"
          fill="none"
          stroke={INK}
          strokeLinecap="round"
          strokeWidth="2"
        />
        <BearFace mood={mood} />
      </svg>
    </span>
  );
}

export type { BearMood };

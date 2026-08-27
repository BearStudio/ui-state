import { createHighlighter } from "@tanstack/highlight/core";
import { tsx } from "@tanstack/highlight/languages/tsx";
import type { HighlightTheme } from "@tanstack/highlight/theme";
import { createThemeCss } from "@tanstack/highlight/theme";
import { githubDarkTheme } from "@tanstack/highlight/themes/github-dark";

export const highlighter = createHighlighter({
  languages: [tsx],
});

const carbonTheme = {
  ...githubDarkTheme,
  name: "carbon",
  type: "dark",
  background: "var(--color-code)",
  foreground: "var(--color-hero-fg)",
  tokens: {
    ...githubDarkTheme.tokens,
    token: "var(--color-hero-fg)",
    attr: "var(--color-code-jsx)",
    comment: "var(--color-code-comment)",
    function: "var(--color-code-fn)",
    keyword: "var(--color-code-kw)",
    literal: "var(--color-code-str)",
    number: "var(--color-code-str)",
    operator: "var(--color-code-kw)",
    property: "var(--color-hero-fg)",
    string: "var(--color-code-str)",
    tag: "var(--color-code-jsx)",
    type: "var(--color-code-fn)",
    variable: "var(--color-hero-fg)",
  },
} satisfies HighlightTheme;

export const highlightThemeCss = createThemeCss({
  dark: carbonTheme,
  darkSelector: "#compare",
});

type DiffKind = "common" | "deleted" | "inserted";

type DiffSegment = {
  code: string;
  kind: DiffKind;
};

function decorationClass(kind: DiffKind) {
  switch (kind) {
    case "common":
      return undefined;
    case "deleted":
      return "th-line--deleted";
    case "inserted":
      return "th-line--inserted";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

export function highlightDiff(segments: ReadonlyArray<DiffSegment>) {
  const parts: string[] = [];
  const decorations: Array<{
    className: string;
    lines: readonly [number, number];
  }> = [];
  let line = 1;

  for (const segment of segments) {
    const lineCount = segment.code.split("\n").length;
    const className = decorationClass(segment.kind);
    if (className) {
      decorations.push({
        className,
        lines: [line, line + lineCount - 1],
      });
    }
    parts.push(segment.code);
    line += lineCount;
  }

  return highlighter.highlightToHtml(parts.join("\n"), {
    lang: "tsx",
    decorations,
  });
}

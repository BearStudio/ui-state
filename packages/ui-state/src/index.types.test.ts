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

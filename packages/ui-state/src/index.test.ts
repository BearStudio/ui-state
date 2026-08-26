import { describe, it, expect } from "vitest";
import { getUiState } from "./index.js";

describe("getUiState", () => {
  describe("basic state creation", () => {
    it("should create a UI state with a simple status", () => {
      const ui = getUiState((set) => set("pending"));

      expect(ui.state.__status).toBe("pending");
    });

    it("should create a UI state with status and data", () => {
      const ui = getUiState((set) => set("default", { value: 42 }));

      expect(ui.state.__status).toBe("default");
      expect(ui.state.value).toBe(42);
    });

    it("should handle custom status values", () => {
      const ui = getUiState((set) => set("custom-status", { data: "test" }));

      expect(ui.state.__status).toBe("custom-status");
      expect(ui.state.data).toBe("test");
    });
  });

  describe("is() method", () => {
    it("should return true when status matches", () => {
      const ui = getUiState((set) => set("pending"));

      expect(ui.is("pending")).toBe(true);
    });

    it("should return false when status does not match", () => {
      const ui = getUiState((set) => set("pending"));

      // @ts-expect-error this typings should always break as error is not defined
      expect(ui.is("error")).toBe(false);
      // @ts-expect-error this typings should always break as default is not defined
      expect(ui.is("default")).toBe(false);
    });

    it("should work with custom status values", () => {
      const ui = getUiState((set) => set("loading-data"));

      expect(ui.is("loading-data")).toBe(true);

      // @ts-expect-error this typings should always break as pending is not defined
      expect(ui.is("pending")).toBe(false);
    });
  });

  describe("when() method", () => {
    it("should execute handler when status matches (string)", () => {
      const ui = getUiState((set) => set("pending"));

      const result = ui.when("pending", () => "loading");

      expect(result).toBe("loading");
    });

    it("should return null when status does not match (string)", () => {
      const ui = getUiState((set) => set("pending"));

      // @ts-expect-error this typings should always break as error is not defined
      const result = ui.when("error", () => "error message");

      expect(result).toBeNull();
    });

    it("should execute handler when status matches (array)", () => {
      const ui = getUiState((set) => set("pending"));

      // @ts-expect-error this typings should always break as error is not defined
      const result = ui.when(["pending", "error"], () => "state matched");

      expect(result).toBe("state matched");
    });

    it("should return null when status does not match any in array", () => {
      const ui = getUiState((set) => set("pending"));

      // @ts-expect-error this typings should always break as error and default are not defined
      const result = ui.when(["error", "default"], () => "not matched");

      expect(result).toBeNull();
    });

    it("should pass state data to handler", () => {
      const ui = getUiState((set) => set("default", { count: 5 }));

      const result = ui.when("default", (data) => data.count * 2);

      expect(result).toBe(10);
    });

    it("should handle array of statuses with data", () => {
      const ui = getUiState((set) => set("error", { message: "Failed" }));

      // @ts-expect-error this typings should always break as not-found is not defined
      const result = ui.when(["error", "not-found"], (data) => data.message);

      expect(result).toBe("Failed");
    });
  });

  describe("match() with exhaustive()", () => {
    it("should render the matched status", () => {
      const ui = getUiState((set) => set("pending"));

      const result = ui.match("pending", () => "Loading...").exhaustive();

      expect(result).toBe("Loading...");
    });

    it("should render the correct match for default status", () => {
      const ui = getUiState((set) => set("default", { value: "test" }));

      const result = ui
        .match("default", (data) => `Content: ${data.value}`)
        .exhaustive();

      expect(result).toBe("Content: test");
    });

    it("should handle multiple statuses in a single match", () => {
      const status = "error" as "error" | "not-found" | "default";
      const ui = getUiState((set) => {
        if (status === "not-found") {
          return set("not-found");
        }
        if (status === "default") {
          return set("default");
        }
        return set("error");
      });

      const result = ui
        .match(["error", "not-found"], () => "Error occurred")
        .match("default", () => "Content")
        .exhaustive();

      expect(result).toBe("Error occurred");
    });

    it("should pass data to handler", () => {
      const status = "default" as "pending" | "error" | "default";
      const ui = getUiState((set) => {
        if (status === "pending") {
          return set("pending");
        }

        if (status === "error") {
          return set("error");
        }

        return set("default", { items: [1, 2, 3], total: 3 });
      });

      const result = ui
        .match("pending", () => "Loading")
        .match("error", () => "Error")
        .match("default", ({ total }) => `Total: ${total}`)
        .exhaustive();

      expect(result).toBe("Total: 3");
    });

    it("should chain multiple matches correctly", () => {
      const status = "empty" as
        | "default"
        | "not-found"
        | "pending"
        | "error"
        | "empty";
      const ui = getUiState((set) => {
        if (status === "default") {
          return set("default");
        }

        if (status === "not-found") {
          return set("not-found");
        }

        if (status === "pending") {
          return set("pending");
        }

        if (status === "error") {
          return set("error");
        }

        return set("empty");
      });

      const result = ui
        .match("pending", () => "Loading")
        .match("error", () => "Error")
        .match("empty", () => "No items")
        .match("default", () => "Content")
        .match("not-found", () => "Not found")
        .exhaustive();

      expect(result).toBe("No items");
    });

    it("should only execute the first matching handler", () => {
      const status = "pending" as "pending" | "default";
      const ui = getUiState((set) => {
        if (status === "default") {
          return set("default");
        }

        return set("pending");
      });

      let executionCount = 0;

      const result = ui
        .match("pending", () => {
          executionCount++;
          return "First match";
        })
        .match("default", () => {
          executionCount++;
          return "Third match";
        })
        .exhaustive();

      expect(result).toBe("First match");
      expect(executionCount).toBe(1);
    });
  });

  describe("match() with nonExhaustive()", () => {
    it("should render the matched status", () => {
      const ui = getUiState((set) => set("pending"));

      const result = ui.match("pending", () => "Loading...").nonExhaustive();

      expect(result).toBe("Loading...");
    });

    it("should return null when no status matches", () => {
      const status = "default" as "pending" | "error" | "default";
      const ui = getUiState((set) => {
        if (status === "pending") {
          return set("pending");
        }

        if (status === "error") {
          return set("error");
        }

        return set("default");
      });

      const result = ui
        .match("pending", () => "Loading...")
        .match("error", () => "Error")
        .nonExhaustive();

      expect(result).toBeNull();
    });

    it("should allow partial matching", () => {
      const ui = getUiState((set) => set("error", { code: 404 }));

      const result = ui
        .match("error", (data) => `Error ${data.code}`)
        .nonExhaustive();

      expect(result).toBe("Error 404");
    });

    it("should handle array of statuses", () => {
      const status = "not-found" as "error" | "not-found";
      const ui = getUiState((set) => {
        if (status === "error") {
          return set("error");
        }

        return set("not-found");
      });

      const result = ui
        .match(["error", "not-found"], () => "Something went wrong")
        .nonExhaustive();

      expect(result).toBe("Something went wrong");
    });
  });

  describe("complex scenarios", () => {
    it("should handle conditional state setting based on data", () => {
      const createUiState = (status: "success" | "error") => {
        return getUiState((set) => {
          if (status === "error") {
            return set("error", { message: "Something went wrong" });
          }
          return set("default", { data: "Success!" });
        });
      };

      const errorUi = createUiState("error");
      expect(errorUi.is("error")).toBe(true);
      if (errorUi.is("error")) {
        expect(errorUi.state.message).toBe("Something went wrong");
      }

      const successUi = createUiState("success");
      expect(successUi.is("default")).toBe(true);
      if (successUi.is("default")) {
        expect(successUi.state.data).toBe("Success!");
      }
    });

    it("should handle empty data object", () => {
      const ui = getUiState((set) => set("pending", {}));

      expect(ui.state.__status).toBe("pending");
      expect(Object.keys(ui.state)).toEqual(["__status"]);
    });

    it("should handle complex nested data structures", () => {
      const ui = getUiState((set) =>
        set("default", {
          user: {
            name: "John",
            age: 30,
            preferences: {
              theme: "dark",
            },
          },
          settings: {
            notifications: true,
          },
        }),
      );

      expect(ui.state.user.name).toBe("John");
      expect(ui.state.user.preferences.theme).toBe("dark");
      expect(ui.state.settings.notifications).toBe(true);
    });

    it("should work with all built-in status types", () => {
      const statuses = [
        "pending",
        "not-found",
        "error",
        "empty-search",
        "empty",
        "default",
      ] as const;

      statuses.forEach((status) => {
        const ui = getUiState((set) => set(status));
        expect(ui.is(status)).toBe(true);
        expect(ui.state.__status).toBe(status);
      });
    });

    it("should handle match chains with mixed array and single status matches", () => {
      const status = "error" as
        | "default"
        | "not-found"
        | "pending"
        | "empty"
        | "error";
      const ui = getUiState((set) => {
        if (status === "default") {
          return set("default");
        }

        if (status === "not-found") {
          return set("not-found");
        }

        if (status === "pending") {
          return set("pending");
        }

        if (status === "empty") {
          return set("empty");
        }

        return set("error");
      });

      const result = ui
        .match("pending", () => "Loading")
        .match(["error", "not-found"], () => "Error state")
        .match("empty", () => "No data")
        .match("default", () => "Success")
        .exhaustive();

      expect(result).toBe("Error state");
    });

    it("should maintain type safety with custom statuses", () => {
      const ui = getUiState((set) => {
        return set("custom-loading", { progress: 50 });
      });

      expect(ui.is("custom-loading")).toBe(true);
      expect(ui.state.progress).toBe(50);

      const result = ui.when("custom-loading", (data) => `${data.progress}%`);
      expect(result).toBe("50%");
    });
  });

  describe("edge cases", () => {
    it("should handle undefined data parameter", () => {
      const ui = getUiState((set) => set("pending"));

      expect(ui.state.__status).toBe("pending");
    });

    it("should handle handlers that return different types", () => {
      const ui = getUiState((set) => set("default", { count: 5 }));

      const numberResult = ui.when("default", (data) => data.count);
      expect(numberResult).toBe(5);

      const stringResult = ui.when("default", () => "text");
      expect(stringResult).toBe("text");

      const objectResult = ui.when("default", (data) => ({
        value: data.count,
      }));
      expect(objectResult).toEqual({ value: 5 });

      const booleanResult = ui.when("default", () => true);
      expect(booleanResult).toBe(true);
    });

    it("should handle status names with special characters", () => {
      const ui = getUiState((set) => set("status-with-dashes"));

      expect(ui.is("status-with-dashes")).toBe(true);
    });

    it("should handle empty array in when() method", () => {
      const ui = getUiState((set) => set("pending"));

      const result = ui.when([] as never, () => "matched");

      expect(result).toBeNull();
    });
  });

  describe("state immutability", () => {
    it("should not allow state mutation", () => {
      const ui = getUiState((set) => set("default", { value: 42 }));

      expect(Object.isFrozen(ui.state)).toBe(true);
    });
  });
});

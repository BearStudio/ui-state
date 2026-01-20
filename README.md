# @bearstudio/ui-state

A lightweight utility to handle dynamic UI display states like `loading`, `error`, or any custom-defined state — based on your app logic.

## ✨ Features

- 🧠 Declarative and expressive API
- 🔁 Dynamic state evaluation with conditions
- ✅ Fully customizable states and payloads

---

## 📦 Installation

```bash
pnpm install @bearstudio/ui-state
npm install @bearstudio/ui-state
yarn add @bearstudio/ui-state
```

## 🚀 Basic Usage

```tsx
import { getUiState } from "@bearstudio/ui-state";

const ui = getUiState((set) => {
  if (bookQuery.status === "pending") return set("pending");
  if (bookQuery.status === "error") return set("error");
  return set("default", { book: bookQuery.data });
});
```

Rendering in React

```tsx
ui.match("pending", () => <>Loading...</>)
  .match("error", () => <>Error</>)
  .match("default", ({ book }) => <>{book.title}</>)
  .exhaustive();
```

## 🪄 Fully customizable and type-safe

```tsx
const ui = getUiState((set) => {
  if (booksToImport === null) return set("show-input");
  if (booksToImport.length === 0) return set("empty");
  return set("listing", { booksToImport });
});

ui.is("show-input"); // valid
ui.is("default"); // invalid
```

## 📖 APIs

#### `is`

```tsx
ui.is("pending"); // Return true if state is `pending`, false otherwise
```

#### `when`

```tsx
ui.when("pending", () => <>Loading...</>); // Render only when state is `pending`
```

#### `match` + `exhaustive`

```tsx
ui
  .match("pending", () => <>Loading...</>); // Render when state is `pending`
  .match("error", () => <>Error...</>); // Render when state is `error`
  .match("default", () => <>Error...</>); // Render when state is `default`
  .exhaustive(); // Ensures all possible states are matched and rendered
```

#### `match` + `nonExhaustive`

```tsx
ui
  .match("pending", () => <>Loading...</>); // Render when state is `pending`
  .match("default", () => <>Error...</>); // Render when state is `default`
  .nonExhaustive(); // Allows rendering without matching all possible states
```

## 📃 License MIT

> Made with ❤️ by BearStudio Team

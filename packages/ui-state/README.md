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

When the status is already known, pass it directly — no `set()` callback:

```tsx
getUiState(query.status)
  .match("pending", () => <>Loading...</>)
  .match("error", () => <>Error</>)
  .match("success", () => <>Ready</>)
  .exhaustive();
```

## 📃 License MIT

> Made with ❤️ by BearStudio Team

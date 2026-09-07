# Addis Eatery - React Cart & Fetching System

This project implements state management and data fetching for Addis Eatery using custom hooks, Context API, and `useReducer`.

## Submitted Files
- `useFetch.js`: Custom hook for fetching data with request cancellation (`AbortController`).
- `cartReducer.js`: Pure reducer handling cart action types (`add`, `remove`, `clear`).
- `CartProvider.jsx`: Context provider supplying cart state, total, and `useCart` custom hook.
- `Menu.jsx`: Menu interface component integrating category filtering, dish displays, checkout panel, and order form.
- `CartBadge.jsx`: Header badge displaying total items and cost from `useCart` without receiving props.

## What Each Hook Contributes

### 1. `useFetch`
- **Purpose**: Encapsulates data fetching operations (e.g. loading `menu.json`).
- **Cancellation**: Instantiates an `AbortController` in `useEffect`. When the component unmounts or the `url`/category changes, the cleanup function calls `controller.abort()`, cancelling any pending request to prevent race conditions and unneeded state updates.
- **Returns**: `{ data, loading, error }`.

### 2. `useCart`
- **Purpose**: Gives child components direct access to cart state (`items`, `total`) and `dispatch` from `CartProvider`.
- **Avoids Prop Drilling**: Enables components like `CartBadge` and `Menu` to read or modify cart state without passing props through parent components like `Header` or `App`.
- **Memoisation**: `CartProvider` memoises its context value (`{ items, dispatch, total }`) using `useMemo`, preventing unnecessary consumer re-renders.

## Verification Answers

1. **Header Badge Independence**: `CartBadge` consumes `useCart()` directly without receiving any props from `Header` or `App`.
2. **Reducer Purity**: `cartReducer` is a pure function that can be imported and unit tested outside React.
3. **Derived Total**: `total` is derived on every render via `state.items.reduce((s, d) => s + d.price, 0)` rather than stored in reducer state.
4. **Synchronous Updates**: Dispatched actions (e.g., adding/removing dishes) immediately update `CartBadge`, the checkout panel, and the total.
5. **Memoised Provider Value**: The `value` object in `CartProvider` is wrapped in `useMemo` to prevent re-renders when parent components re-render.
6. **Fetch Cancellation**: `useFetch` cancels previous pending requests when category or URL changes using `AbortController.abort()`.

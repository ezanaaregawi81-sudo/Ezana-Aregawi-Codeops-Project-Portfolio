# Addis Eatery - React Cart & Fetching System

This project implements state management and data fetching for Addis Eatery using custom hooks, Context API, and a persisted Zustand store.

## Submitted Key Files
- `App.jsx`: Main routing tree configured with nested `<Layout />` parent, `<ThemeProvider>` and `<AuthProvider>` context wrappers, index route, dynamic dish route, protected checkout route, and catch-all route.
- `Layout.jsx`: Master layout wrapper component rendering common header and Outlet for child screens.
- `DishDetail.jsx`: Dynamic dish details page reading URL parameters via `useParams()`.
- `RequireAuth.jsx`: Authentication route guard protecting `/checkout`, reading `useAuth()`, displaying a loading state, and remembering original destination.
- `useFetch.js`: Custom hook for fetching data with request cancellation (`AbortController`).
- `store/cartStore.js`: Zustand store (with `persist` middleware) holding cart `items` and the `addItem`/`removeItem`/`clear` actions.
- `store/useCart.js`: Narrow selector hooks (`useCartItems`, `useCartCount`, `useCartTotal`, `useAddToCart`, `useRemoveFromCart`, `useClearCart`) so consumers never call the store directly.
- `context/AuthProvider.jsx` + `context/authContext.js`: Auth session context with the guarded `useAuth()` hook.
- `context/ThemeProvider.jsx` + `context/themeContext.js`: Light/dark theme context with the guarded `useTheme()` hook.
- `Menu.jsx`: Menu interface component integrating shareable query string category filtering (`/menu?category=Vegan`), dish displays, and cart status.
- `CartBadge.jsx`: Header badge displaying total items and cost via the narrow `useCartCount`/`useCartTotal` selectors, without receiving props.

## Route Table

| Route Path | Component | Guard / Protection | Description |
|---|---|---|---|
| `/` | `<Home />` | None (Public) | Index landing page showcasing Addis Eatery |
| `/menu` | `<Menu />` | None (Public) | Menu page supporting shareable category query params (e.g. `/menu?category=Vegan`) |
| `/menu/:id` | `<DishDetail />` | None (Public) | Dynamic dish details page reading parameter with `useParams` |
| `/cart` | `<Cart />` | None (Public) | Interactive shopping cart screen persisting order across navigation |
| `/login` | `<Login />` | None (Public) | User authentication page saving intended destination |
| `/checkout` | `<Checkout />` | `RequireAuth` | Protected checkout page; redirects unauthenticated users to `/login` |
| `*` | `<NotFound />` | None (Public) | Catch-all 404 page for unknown URLs |

## What Each Hook Contributes

### 1. `useFetch`
- **Purpose**: Encapsulates data fetching operations (e.g. loading `/menu.json`).
- **Cancellation**: Instantiates an `AbortController` in `useEffect`. When the component unmounts or the `url`/category changes, the cleanup function calls `controller.abort()`, cancelling any pending request to prevent race conditions and unneeded state updates.
- **Returns**: `{ data, loading, error }`.

### 2. `store/useCart.js` selector hooks
- **Purpose**: Give child components direct, narrow access to cart state and actions from the Zustand `cartStore`, e.g. `useCartTotal()` or `useAddToCart()`.
- **Avoids Prop Drilling**: Enables components like `CartBadge` and `Menu` to read or modify cart state without passing props through parent components like `Header` or `App`.
- **Narrow Selectors**: Each hook subscribes to a single slice (`state.items`, `state.items.length`, an action) instead of the whole store, so a component re-renders only when the slice it reads actually changes.

### 3. `useAuth` / `useTheme`
- **Purpose**: Guarded context hooks — each throws if called outside its provider, catching a missing `<AuthProvider>`/`<ThemeProvider>` at development time instead of failing silently.
- **Memoisation**: Both providers memoise their context value with `useMemo` to prevent unnecessary consumer re-renders.

## Why the Cart Lives in a Store, Not Context

The cart is shopping-cart *data* — items a user collects, that should survive a page refresh and that many unrelated components (badge, menu, cart page, checkout) read and mutate independently. A Zustand store with the `persist` middleware fits that: it writes to `localStorage` on every change, restores it on load, and lets each consumer subscribe to only the slice it needs via a selector, so adding a dish doesn't re-render components that only read the item count.

The auth session is different: it's ephemeral, request-scoped identity, not user-generated data. It only needs to be visible to the small part of the tree that cares about it (the header, `RequireAuth`, `Login`), it doesn't need selector-level render optimisation, and it stays in sync with `localStorage` purely as an implementation detail of *this* session rather than as its source of truth. React Context — behind a guarded `useAuth()` hook — is the right amount of machinery for that; reaching for a global store would be over-engineering a value only a couple of components ever read.

## Verification Answers

1. **Header Badge Independence**: `CartBadge` consumes `useCartCount()`/`useCartTotal()` directly without receiving any props from `Header` or `App`.
2. **Store Purity**: `cartStore.js` actions (`addItem`, `removeItem`, `clear`) are plain state updates that can be tested outside React via `useCartStore.getState()`.
3. **Derived Total**: `total` is derived on every render via a selector (`state.items.reduce((sum, item) => sum + item.price, 0)`) rather than stored separately.
4. **Synchronous Updates**: Cart actions (e.g., adding/removing dishes) immediately update `CartBadge`, the checkout panel, and the total.
5. **Persisted Cart**: The Zustand `persist` middleware writes cart state to `localStorage` under `addis-eatery-cart`, so a page reload restores the order.
6. **Fetch Cancellation**: `useFetch` cancels previous pending requests when category or URL changes using `AbortController.abort()`.
7. **Shareable Category**: `/menu?category=Vegan` correctly highlights the Vegan chip and displays filtered menu items on fresh tab loads.
8. **Protected Route & Redirect**: Accessing `/checkout` while signed out redirects to `/login` and navigates back to `/checkout` after login, using `useAuth()` from `AuthProvider`.


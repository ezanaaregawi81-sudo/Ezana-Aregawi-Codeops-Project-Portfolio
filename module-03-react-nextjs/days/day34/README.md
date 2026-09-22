# Sheba Kitchen — App Router routing exercise

A small Next.js App Router app used to practice file-based routing, nested
segments, dynamic route params, and route-level `loading` / `error` /
`not-found` boundaries.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Landing screen with links into the app |
| `/home` | Featured dishes |
| `/menu` | Full menu, filterable by category |
| `/menu/[id]` | Single dish detail page |
| `/cart` | Basket contents, quantity controls |
| `/checkout` | Placeholder checkout step |

`app/menu` also ships `loading.jsx`, `error.jsx`, and `not-found.jsx` to cover
the async, thrown-error, and missing-id cases for that segment.

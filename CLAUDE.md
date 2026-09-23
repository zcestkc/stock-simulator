# Stalk — frontend

Stock & crypto investment simulator. Next.js 15 (App Router) + React 19 + TypeScript,
Tailwind CSS 3, TanStack Query 5. Early stage.

## Rules

- **Colours come from CSS tokens only.** Never hard-code a colour in a component: no hex/rgb
  values, and no Tailwind palette classes like `text-gray-500`, `bg-white`, `text-green-600`.
  - Tokens are defined once in `src/styles/globals.css` (`:root`, HSL channels) and mapped
    to Tailwind in `tailwind.config.ts`.
  - **Tokens are scoped by role.** Each one only exists for the utilities that fit it, so a
    wrong pairing (`text-card`, `bg-muted-foreground`) generates no CSS:

    | Role | Tokens | Utilities |
    |---|---|---|
    | Surface | `background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `overlay`, `sidebar`, `sidebar-accent`, `sidebar-active` | `bg-*`, `ring-offset-*` |
    | Foreground | `foreground`, `<surface>-foreground` (e.g. `card-foreground`, `primary-foreground`), `muted-foreground`, `link`, `sidebar-foreground`, `sidebar-muted`, `sidebar-active-foreground` | `text-*` |
    | Line | `border`, `input`, `ring` | `border-*`, `divide-*`, `ring-*` |
    | Status | `positive`, `negative`, `destructive`, `info`, `warning` | all of the above (text, borders, tinted bg like `bg-positive/10`) |
    | JS-only | `chart-grid`, `chart-1` | none; use `tokenColor()` |

    Text on a surface uses that surface's `-foreground` pair: `bg-primary text-primary-foreground`.
  - A class that "does nothing" usually means the wrong role: check it's in the table.
  - In JS (canvas charts, SVG props) use `tokenColor('positive')` or
    `tokenColor('positive', 0.2)` from `src/utils/css-tokens.ts`. Any token works here.
  - Need a new colour? Add a semantic token (named for its role, e.g. `--chart-grid`, not
    `--light-grey`) in `globals.css`, then register it under the right role in
    `tailwind.config.ts` (skip that for JS-only tokens).
  - Price direction is always `positive` (up) / `negative` (down); errors are `destructive`.
- **The browser only talks to this Next.js app.** Client code calls same-origin `/api/*`
  through `lib/api-client.ts`; never call StalkApi or third-party APIs from the browser, and
  never put the API URL or keys in `NEXT_PUBLIC_*` vars. (The old Alpha Vantage crypto code
  breaks this and is due to be moved behind StalkApi.)
- **Token refresh lives in one function**, `refreshTokens()` in `lib/server/api-upstream.ts`,
  used by both the `/api` proxy and middleware. Don't add refresh logic anywhere else.
- New Tailwind class locations must be covered by `content` in `tailwind.config.ts`, or the
  classes silently won't be generated.
- Features don't import from other features. Shared code goes in `components/`, `lib/`,
  `utils/`, `types/`.

## System design

```
                ┌──────────── Next.js (stalk-fe, :3000) ────────────┐
Browser ──────► │ pages (SSR)          ───┐                         │
  same-origin   │ /api/* proxy route   ───┼──► StalkApi (.NET 9, :5030/api) ──► Postgres (Docker, :5432)
  only          │ middleware (auth)    ───┘          │              │
                └───────────────────────────────────┼──────────────┘
                                                     └──► Yahoo Finance (market data, cached)
```

Next.js is a **backend-for-frontend (BFF)**: StalkApi is never called from the browser, so it
needs no CORS and its URL is server-only (`API_URL` in `.env`).

- **StalkApi** (`../StalkApi`) owns everything: auth, users, and market data. It fetches
  prices from Yahoo Finance behind an `IStockDataProvider` interface and caches them in memory
  (quotes 60s, history 1min–1h depending on range), so all users share each upstream fetch.
  Yahoo is unofficial; if it breaks, swap the provider — the frontend doesn't change.
- **API calls** (`lib/api-client.ts`): in the browser, requests go to `/api/...`; on the server
  (server components), they go straight to `API_URL` with the request's cookies.
- **`/api` proxy** (`app/api/[...path]/route.ts`): forwards method, path, query, body and
  cookies to StalkApi and passes status, body and `Set-Cookie` back. On a 401 it refreshes the
  tokens once and retries (not for `auth/login|register|logout|refresh-token`). If StalkApi
  is unreachable it returns 502.
- **Auth**: JWT in httpOnly cookies (`accessToken` 5 min, `refreshToken` 30 days) set by the
  API and passed through the proxy. `src/middleware.ts` guards page routes (everything except
  `/`, `/auth/*`, `/api/*`): no refresh token → redirect to login; no access token → refresh, then
  write the new cookies onto the *request* as well as the response, so server components
  rendering that same request see them; refresh fails → clear cookies and redirect to login.
- **Data fetching**: server components prefetch with a `QueryClient` and pass state down via
  `HydrationBoundary`; client components read the same data with `useQuery` hooks. Query
  options live next to the fetcher so the server and client share keys and stale times.
- **Charts**: `lightweight-charts` (TradingView, Apache 2.0) for price charts. Keep
  `attributionLogo: true` — it's the licence's attribution requirement. Recharts is still used
  by the legacy crypto page.

## Folder structure

Loosely follows [bulletproof-react](https://github.com/alan2207/bulletproof-react).

```
src/
├── app/                      # Next.js routes only — thin pages that compose features
│   ├── page.tsx              #   landing page (public)
│   ├── auth/                 #   login/register (public)
│   └── app/                  #   authenticated app, wrapped in _components/home-layout (side nav)
│       ├── stocks/           #     /app/stocks list, /app/stocks/[symbol] detail + chart
│       ├── cryptos/          #     /app/cryptos (legacy, Alpha Vantage)
│       └── profile/
├── features/<name>/          # one folder per domain feature
│   ├── api/                  #   fetchers + queryOptions + useX hooks (one file per endpoint)
│   └── components/           #   feature UI
├── components/               # shared, feature-agnostic UI
│   ├── ui/                   #   primitives (button, drawer, dropdown, form, spinner, …)
│   ├── layouts/              #   ContentLayout (page title + container)
│   └── errors/
├── app/api/[...path]/        # (under app/) the BFF proxy route to StalkApi
├── lib/                      # app infrastructure: api-client, auth hooks, react-query config
│   └── server/               #   server-only: api-upstream (API_URL, refreshTokens, cookie helpers)
├── config/                   # env (zod-validated), paths (all route hrefs — use these, don't hard-code URLs)
├── types/api.ts              # API response types (mirror the API's DTOs)
├── utils/                    # small helpers: cn, css-tokens, eod
├── styles/globals.css        # Tailwind layers + design tokens
└── middleware.ts             # auth guard / token refresh
```

### Adding a feature (pattern to copy: `features/stocks`)

1. Types in `types/api.ts`, matching the API DTO.
2. `features/<name>/api/get-<thing>.ts`: fetcher via `api.get('/path')`, a
   `get<Thing>QueryOptions()` and a `use<Thing>()` hook.
3. Components in `features/<name>/components/` (`'use client'` if they use hooks).
4. Route in `app/app/<name>/page.tsx`: prefetch + `HydrationBoundary`, wrap in `ContentLayout`.
5. Add the href to `config/paths.ts` and, if it's top-level, the nav item in `home-layout.tsx`.

## Commands

```bash
yarn dev          # dev server on :3000 (Turbopack); needs StalkApi running at API_URL (.env)
yarn build
yarn test         # vitest
npx tsc --noEmit  # type-check
```

`yarn lint` is currently broken (ESLint 9 with a legacy `.eslintrc.cjs`); run
`ESLINT_USE_FLAT_CONFIG=false npx eslint <paths>` instead. Formatting: Prettier (`.prettierrc`).

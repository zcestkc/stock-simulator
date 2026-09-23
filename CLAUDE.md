# Stock Simulator — frontend

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
    | JS-only | `chart-grid` | none; use `tokenColor()` |

    Text on a surface uses that surface's `-foreground` pair: `bg-primary text-primary-foreground`.
  - A class that "does nothing" usually means the wrong role: check it's in the table.
  - In JS (canvas charts, SVG props) use `tokenColor('positive')` or
    `tokenColor('positive', 0.2)` from `src/utils/css-tokens.ts`. Any token works here.
  - Need a new colour? Add a semantic token (named for its role, e.g. `--chart-grid`, not
    `--light-grey`) in `globals.css`, then register it under the right role in
    `tailwind.config.ts` (skip that for JS-only tokens).
  - Price direction is always `positive` (up) / `negative` (down); errors are `destructive`.
  - **Dark mode** is the same tokens with different values under `.dark` in `globals.css`.
    A new token needs a value in both `:root` and `.dark`. Don't use `dark:` colour classes;
    `dark:` is only for non-colour tweaks (e.g. `dark:invert` on the black logo image).
    Theme is handled by `next-themes` (`ThemeProvider` in `app/provider.tsx`: Light/Dark/System,
    saved in localStorage under `theme`, System follows the OS, no flash on load). Read it with
    `useTheme()` from `next-themes`; `theme`/`resolvedTheme` are only reliable after mount.
    Anything that reads `tokenColor()` once (e.g. canvas charts) must re-run when
    `resolvedTheme` changes.
- **The browser only talks to this Next.js app.** Client code calls same-origin `/api/*`
  through `lib/api-client.ts`; never call StockSimulatorApi or third-party APIs from the browser, and
  never put the API URL or keys in `NEXT_PUBLIC_*` vars.
- **Every page is public.** Login is only required for actions on the user's money (investing,
  portfolio), and that's enforced by the API (`[Authorize]`), not by page routing. Logged-out
  UI shows a "Log in" prompt that returns the user to where they were (`?redirectTo=`); never
  redirect a page to login. `useUser().data === null` means logged out.
- **Token refresh lives in one function**, `refreshTokens()` in `lib/server/api-upstream.ts`,
  used by both the `/api` proxy and middleware. Don't add refresh logic anywhere else.
- **URLs come from `config/paths.ts`** (`paths.app.stocks.getHref()`), never hard-coded strings.
  Sidebar pages live in the `app/(main)/` route group.
- New Tailwind class locations must be covered by `content` in `tailwind.config.ts`, or the
  classes silently won't be generated.
- **React Compiler is on** (`experimental.reactCompiler` in `next.config.ts`,
  `babel-plugin-react-compiler`). It memoises components, hooks and derived values at build time,
  so don't add `useMemo`, `useCallback` or `React.memo` by hand. Write plain code; it only works
  if components follow the [Rules of React](https://react.dev/reference/rules) (pure render, no
  mutating props/state; `yarn lint` checks them). Don't set state directly in an effect body
  (`react-hooks/set-state-in-effect`): derive it during render instead. To opt a
  component out while debugging, put `'use no memo';` at the top of its body.
- **React 19: no `forwardRef`.** `ref` is a regular prop. Type props with
  `React.ComponentProps<'button'>` / `React.ComponentProps<typeof Primitive.Root>` (these include
  `ref`) and spread them onto the element. Don't set `displayName` on named components, and avoid
  `ComponentPropsWithoutRef` / `ElementRef`.
- **`app/` is thin.** Route files and their `_components/` only compose features, or hold
  route-level layout (the app shell, auth layout). Real UI with its own data/loading/empty states
  belongs in `features/<name>/components/` (e.g. the profile lives in `features/auth`). Lint can't
  catch this one (the import direction is legal), so check it in review.
- Features don't import from other features. Shared code goes in `components/`, `lib/`,
  `utils/`, `types/`.

## System design

```
                ┌──────────── Next.js (stock-simulator, :3000) ────────────┐
Browser ──────► │ pages (SSR)          ───┐                         │
  same-origin   │ /api/* proxy route   ───┼──► StockSimulatorApi (.NET 9, :5030/api) ──► Postgres (Docker, :5432)
  only          │ middleware (refresh) ───┘          │              │
                └───────────────────────────────────┼──────────────┘
                                                     └──► Yahoo Finance (market data, cached)
```

Next.js is a **backend-for-frontend (BFF)**: StockSimulatorApi is never called from the browser, so it
needs no CORS and its URL is server-only (`API_URL` in `.env`).

- **StockSimulatorApi** (`../stock-simulator-api`) owns everything: auth, users, and market data. It fetches
  prices from Yahoo Finance behind an `IStockDataProvider` interface and caches them in memory
  (quotes 60s, history 1min–1h depending on range), so all users share each upstream fetch.
  Yahoo is unofficial; if it breaks, swap the provider — the frontend doesn't change.
- **API calls** (`lib/api-client.ts`): in the browser, requests go to `/api/...`; on the server
  (server components), they go straight to `API_URL` with the request's cookies.
- **`/api` proxy** (`app/api/[...path]/route.ts`): forwards method, path, query, body and
  cookies to StockSimulatorApi and passes status, body and `Set-Cookie` back. On a 401 it refreshes the
  tokens once and retries (not for `auth/login|register|logout|refresh-token`). If StockSimulatorApi
  is unreachable it returns 502.
- **Auth**: JWT in httpOnly cookies (`accessToken` 5 min, `refreshToken` 30 days) set by the
  API and passed through the proxy. Pages never require login. `src/middleware.ts` only keeps a
  session fresh: if there's a refresh token but no access token, it refreshes and writes the new
  cookies onto the *request* as well as the response (so server components rendering that same
  request see them); if refresh fails it clears the cookie and the visitor continues logged out.
  `lib/auth.ts` `getUser()` returns `null` on 401, and `api-client` never toasts 401s: being
  logged out is a normal state. Callers handle it with `isUnauthorized(error)`.
- **Wallet** (`features/portfolio/components/wallet-summary.tsx`, on `/home`): current value
  (cash + holdings at market) with gain % vs money put in, started with, topped up, and an
  Add money dialog (`POST /portfolio/deposit`). All numbers are computed by the API.
- **Investing** (`features/portfolio`): the Invest button on a stock page sends logged-out users
  to `/auth/login?redirectTo=/stocks/X?invest=1`; on return the dialog opens automatically.
  Buys are by dollar amount (fractional shares); the API prices the order from its own quote.
- **Data fetching**: server components prefetch with a `QueryClient` and pass state down via
  `HydrationBoundary`; client components read the same data with `useQuery` hooks. Query
  options live next to the fetcher so the server and client share keys and stale times.
- **Charts**: `lightweight-charts` (TradingView, Apache 2.0) for price charts. Keep
  `attributionLogo: true` — it's the licence's attribution requirement.

## Folder structure

Loosely follows [bulletproof-react](https://github.com/alan2207/bulletproof-react).

```
src/
├── app/                      # Next.js routes only — thin pages that compose features
│   ├── page.tsx              #   / landing page (no sidebar)
│   ├── auth/                 #   /auth/login, /auth/register (auth layout)
│   ├── api/[...path]/        #   /api/* BFF proxy route to StockSimulatorApi
│   └── (main)/               #   route group: shares the sidebar layout, adds nothing to the URL
│       ├── layout.tsx        #     wraps pages in _components/home-layout (side nav + header)
│       ├── home/             #     /home (renders portfolio WalletSummary)
│       ├── stocks/           #     /stocks list, /stocks/[symbol] detail + chart + Invest
│       │                     #     ([symbol]/_components/stock.tsx composes stocks + portfolio)
│       ├── cryptos/          #     /cryptos — "Coming soon" placeholder (crypto not built yet)
│       └── profile/          #     /profile (renders features/auth UserProfile)
├── features/<name>/          # one folder per domain feature
│   ├── api/                  #   fetchers + queryOptions + useX hooks (one file per endpoint)
│   └── components/           #   feature UI
├── components/               # shared, feature-agnostic UI
│   ├── ui/                   #   primitives (button, drawer, dropdown, form, spinner, …)
│   ├── layouts/              #   ContentLayout (page title + container)
│   └── errors/
├── lib/                      # app infrastructure: api-client, auth hooks, react-query config
│   └── server/               #   server-only: api-upstream (API_URL, refreshTokens, cookie helpers)
├── config/                   # env (zod-validated), paths (all route hrefs — use these, don't hard-code URLs)
├── types/api.ts              # API response types (mirror the API's DTOs)
├── utils/                    # small helpers: cn, css-tokens, eod
├── styles/globals.css        # Tailwind layers + design tokens
└── middleware.ts             # silent token refresh (never blocks a page)
```

### Adding a feature (pattern to copy: `features/stocks`)

1. Types in `types/api.ts`, matching the API DTO.
2. `features/<name>/api/get-<thing>.ts`: fetcher via `api.get('/path')`, a
   `get<Thing>QueryOptions()` and a `use<Thing>()` hook.
3. Components in `features/<name>/components/` (`'use client'` if they use hooks).
4. Route in `app/(main)/<name>/page.tsx`: prefetch + `HydrationBoundary`, wrap in `ContentLayout`.
5. Add the href to `config/paths.ts` and, if it's top-level, the nav item in `home-layout.tsx`.

## Commands

```bash
yarn dev          # dev server on :3000 (Turbopack); needs StockSimulatorApi running at API_URL (.env)
yarn build
yarn test         # vitest
npx tsc --noEmit  # type-check
```

`yarn lint` / `yarn lint-fix` run ESLint 9 with the flat config in `eslint.config.mjs` (keep it at
0 problems). It includes typescript-eslint's **type-checked** rules (`recommendedTypeChecked`, via
`projectService`: no floating/misused promises, no unsafe `any`; prefer `unknown` + a cast/check),
React recommended + JSX runtime, Prettier (`.prettierrc`, `endOfLine: auto` because git checks files
out with CRLF on Windows), the Rules of Hooks + React Compiler rules (`eslint-plugin-react-hooks` v7
`recommended-latest`, `exhaustive-deps` as an error),
Next.js, a11y, Tailwind class checks, kebab-case file/folder names, and import boundaries
(features can't import each other; shared code can't import features/app). Import sorting is left
to the editor (`source.sortImports`), so `import/order` is off. The `typescript-eslint` packages are
pinned to 8.20 because newer ones need Node ≥ 22.13.

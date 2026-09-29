# Social Feed Explorer

A **Social Feed Explorer** built with Next.js App Router and TypeScript, designed to browse, search, and filter a large volume of social feed content.


## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000/feed](http://localhost:3000/feed) in your browser.

Example shareable URL:

```text
/feed?q=react&category=tech&status=published&date=30d
```

Query parameters:

| Param      | Description                          | Example values                                      |
| ---------- | ------------------------------------ | --------------------------------------------------- |
| `q`        | Search (author + content)            | `react`, `Alex Chen`                                |
| `category` | Post category                        | `tech`, `travel`, `music`, `sports`, `food`, `design` |
| `status`   | Post status                          | `published`, `draft`, `archived`, `scheduled`         |
| `date`     | Date range                           | `all`, `today`, `7d`, `30d`                         |

## Features

- 10,000-item deterministic mock dataset
- Virtualized feed with **infinite scroll** (50 posts per page)
- Search (author + content) with 300ms debounce
- Combined filters: category, status, date range
- Shareable URL state (bookmarkable, refresh-safe, back/forward friendly)
- Skeleton loading, error + retry, empty state
- Optimistic like with rollback on simulated failure (~5%)
- Light/dark theme toggle persisted across reloads
- Responsive layout with collapsible filter dropdown

## Mock data & API

There is no external backend. Data lives in `src/utils/mock-data.ts` and is exposed through Next.js Route Handlers under `src/app/api/`.

### How mock data is created

On module load, **10,000 posts** are generated deterministically from small seed arrays of authors and content snippets. Each post gets:

- A stable `id` (`post-1` … `post-10000`)
- Rotating **category** (6 values) and **status** (4 values)
- A **createdAt** timestamp stepped back one hour per index
- Deterministic **likes** and **liked** flags

Because generation is formula-based (not random), the dataset is reproducible across runs and easy to reason about during development.

### API endpoints

| Method | Route                    | Purpose                                      |
| ------ | ------------------------ | -------------------------------------------- |
| `GET`  | `/api/posts`             | Filtered, paginated feed                     |
| `POST` | `/api/posts/[id]/like`   | Toggle like on a post                        |

`GET /api/posts` accepts the same filter query params as the feed page (`q`, `category`, `status`, `date`) plus `page` and `limit`. The handler parses params, calls `queryPosts()` to filter the in-memory dataset, and returns a JSON page with `posts`, `total`, `page`, `limit`, and `hasMore`.

### Simulated network latency

Both API routes include a deliberate `setTimeout` delay so loading and optimistic UI are observable during development:

- **First page:** ~600ms
- **Subsequent pages:** ~450ms
- **Like mutation:** ~400ms (plus a ~5% random failure rate)

This mimics real network latency without requiring an external service.

## Architecture

### Why Next.js App Router (not plain React or Pages Router)?

**vs. plain React (Vite/CRA):**

- Built-in **file-based routing** and layouts — no separate router setup
- **Route Handlers** provide a mock API in the same repo without a standalone server
- Clear **Server / Client Component** boundaries for future SSR or prefetching
- Production-ready defaults (bundling, code splitting, metadata) out of the box

**vs. Next.js Pages Router:**

- **Layouts** (`layout.tsx`) compose cleanly — shared header/theme without prop drilling
- **`useSearchParams`** integrates naturally with shareable filter state
- Route Handlers replace `pages/api` with a colocated, modern API surface
- Better alignment with current Next.js direction and React 19 patterns

For this task, the feed is fully interactive (search, filters, infinite scroll, optimistic likes), so the page itself is a Client Component tree. App Router still adds value through routing, the mock API layer, layouts, and a path to server prefetch later.

### Why TanStack Query?

Server and data state (posts, loading, error, refetch, cache) is managed with **TanStack Query**. This keeps async data concerns separate from UI and URL state, provides built-in caching, and makes retry/error handling straightforward.

#### Client vs. server usage

`getQueryClient()` in `src/utils/query-client.ts` is set up to support **both environments**:

- **Server:** creates a fresh `QueryClient` per request (avoids leaking cache between users)
- **Browser:** reuses a singleton client (preserves cache across navigations)

In this project, **only the client path is used**. `QueryProvider` is a Client Component and all data fetching happens via `fetch()` from the browser (`useInfiniteQuery`, `useMutation`). The server factory exists as a production-ready pattern for future SSR prefetch (e.g. dehydrating the first feed page on the server), but it was not wired up here because the brief focuses on client-side interactivity — search debounce, infinite scroll, and optimistic updates — rather than server-rendered data hydration.

### Alternative: `useFormState`

Likes could also be handled with Next.js **`useFormState`** and a Server Action — a good fit for server-side mutations with built-in pending state. This project uses TanStack Query instead to support optimistic updates and rollback across the infinite feed cache.

### Why virtualization?

Rendering 10,000 DOM nodes would hurt scroll performance. **TanStack Virtual** renders only visible rows plus a small overscan buffer, keeping scrolling smooth as more pages load.

### Why URL state for search and filters?

Search and filter values live in query parameters (`q`, `category`, `status`, `date`). This makes the current view shareable, bookmarkable, and resilient to refresh. Browser back/forward navigation works naturally.

### Theme persistence (no flash)

Theme preference is stored in **`localStorage`** via `src/utils/theme.ts`.

| Layer | Role |
| ----- | ---- |
| **localStorage** | Persists `"light"` or `"dark"` across reloads |
| **Inline script** | Runs in `<head>` before paint — reads `localStorage` (or system preference) and applies the `.dark` class immediately |
| **Inline styles** | Minimal dark background/text before Tailwind CSS loads, preventing a white flash |
| **ThemeToggle** | Client-only (`dynamic` with `ssr: false`); initializes from `localStorage` via lazy `useState`; toggles call `setStoredTheme()` |



### Why no global state library?

State is split by responsibility:

| Concern            | Tool                                      |
| ------------------ | ----------------------------------------- |
| Server/data state  | TanStack Query                            |
| Filter/search state| URL search params                         |
| Theme preference   | localStorage (`src/utils/theme.ts`)          |
| Local UI state     | React state (filter dropdown open/closed) |

There is no need for Redux or Zustand — global client state is minimal and each mechanism maps cleanly to its use case.

## Assumptions

- The dataset is generated locally as deterministic mock data (~10,000 posts)
- A real backend is outside the scope of this project; Route Handlers stand in for one
- Search and filtering run **in the mock API layer** (in-memory filter, then paginate) — the client only receives relevant pages
- Pagination uses **infinite scroll** (50 posts per batch), not a manual "Load more" button
- Like failures are simulated randomly (~5%) to demonstrate rollback behavior

## Performance

### Large-list rendering

Posts are never all mounted in the DOM at once. Virtualization limits rendered nodes to visible items plus overscan.

### Search optimization

Search input is debounced (300ms) before updating URL params and triggering a refetch. Local input state keeps typing responsive while the query key updates on the debounced value.

### Avoiding unnecessary work

- Filter + paginate happen once per API request, not on every keystroke in the full dataset
- Virtualizer resets scroll position when filters change
- Query cache avoids redundant fetches within the stale window (60s)


## Project structure

```text
src/
├── app/
│   ├── api/posts/route.ts          # GET paginated feed
│   ├── api/posts/[id]/like/route.ts
│   ├── feed/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── features/feed/
│   ├── components/                 # FeedExplorer, FeedList, PostCard, …
│   ├── hooks/                      # usePosts, useFeedFilters, useLikePost
│   ├── services/api.ts             # Client fetch helpers
│   ├── types/posts.ts
│   └── utils/                      # filters, parse-feed-params
├── components/
│   ├── ui/                         # Button, Dropdown, Input, Select, …
│   ├── site-header.tsx
│   ├── theme-toggle.tsx
│   └── theme-toggle-slot.tsx      # Client-only dynamic wrapper
├── providers/query-provider.tsx
└── utils/
    ├── mock-data.ts                # Dataset + queryPosts / togglePostLike
    ├── query-client.ts             # Client + server QueryClient factory
    ├── theme.ts                    # Theme persistence, init script/styles
    └── debounce.ts
```

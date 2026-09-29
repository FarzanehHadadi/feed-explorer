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

### Why Next.js App Router?

Next.js provides routing, layouts, and Route Handlers in the same project.
Route Handlers are used here to simulate a backend API while keeping the
project self-contained.

The App Router also provides a clear Server/Client Component boundary
for future server-side data fetching if needed.


### Why TanStack Query?


TanStack Query manages server state, including fetching, caching,
loading/error states, pagination, and optimistic like mutations.

This project uses TanStack Query on the client because the feed is
fully interactive and does not require SSR data hydration.


### Why virtualization?

Rendering 10,000 DOM nodes would hurt scroll performance. **TanStack Virtual** renders only visible rows plus a small overscan buffer, keeping scrolling smooth as more pages load.

### Why URL state for search and filters?

Search and filter values live in query parameters (`q`, `category`, `status`, `date`). This makes the current view shareable, bookmarkable, and resilient to refresh. Browser back/forward navigation works naturally.

### Theme 

The optional light/dark theme is persisted in localStorage.
An initialization script applies the saved or system theme before paint
to avoid a visible theme flash.



### Why no global state library?

State is split by responsibility:

| Concern            | Tool                                      |
| ------------------ | ----------------------------------------- |
| Server/data state  | TanStack Query                            |
| Filter/search state| URL search params                         |
| Theme preference   | localStorage (`src/utils/theme.ts`)          |
| Local UI state     | React state (filter dropdown open/closed) |

The application does not require a separate global client-state library because each state concern has a clear owner.

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

- Debounced search prevents a request on every keystroke.
- Filtering and pagination are performed in the mock API layer.
- Virtualization keeps the number of mounted DOM nodes small.
- Query caching avoids unnecessary refetches within the stale window.


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
## Intentional omissions

- No real authentication or user accounts — outside the scope of the task.
- No real backend or database — the API is intentionally implemented with
  in-memory mock data.
- No SSR hydration for the feed — the task is focused on client-side
  interaction, filtering, pagination, and virtualization.
- No external UI component library — the UI is implemented with Tailwind
  and small reusable components.
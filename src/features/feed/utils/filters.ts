import type { FeedFilters, Post } from "../types/posts";

function makeTextLowerCase(value: string): string {
  return value.trim().toLowerCase();
}

function matchesSearch(post: Post, query: string): boolean {
  if (!query) return true;
  const q = makeTextLowerCase(query);
  return (
    makeTextLowerCase(post.author).includes(q) ||
    makeTextLowerCase(post.content).includes(q)
  );
}

function matchesCategory(
  post: Post,
  category: FeedFilters["category"],
): boolean {
  if (category === "all") return true;
  return post.category === category;
}

function matchesStatus(post: Post, status: FeedFilters["status"]): boolean {
  if (status === "all") return true;
  return post.status === status;
}

function matchesDate(post: Post, dateFilter: FeedFilters["date"]): boolean {
  if (dateFilter === "all") return true;

  const created = new Date(post.createdAt).getTime();
  const now = Date.now();
  const dayMs = 86_400_000;

  switch (dateFilter) {
    case "today": {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return created >= startOfToday.getTime();
    }
    case "7d":
      return created >= now - 7 * dayMs;
    case "30d":
      return created >= now - 30 * dayMs;
    default:
      return true;
  }
}

export function filterPosts(posts: Post[], filters: FeedFilters): Post[] {
  const { search, category, status, date } = filters;

  return posts.filter(
    (post) =>
      matchesSearch(post, search) &&
      matchesCategory(post, category) &&
      matchesStatus(post, status) &&
      matchesDate(post, date),
  );
}

import type {
  Category,
  DateFilter,
  Post,
  Status,
} from "../features/feed/types/posts";
import { CATEGORIES, STATUSES } from "../features/feed/types/posts";
import { filterPosts } from "../features/feed/utils/filters";

const TOTAL_POSTS = 10_000;

const authors = [
  "Alex Chen",
  "Jordan Lee",
  "Sam Rivera",
  "Taylor Brooks",
  "Morgan Kim",
  "Casey Walsh",
  "Riley Nguyen",
  "Jamie Patel",
  "Quinn O'Brien",
  "Avery Santos",
];

const contents = [
  "Just shipped a new feature using React and TypeScript.",
  "Exploring performance patterns for large-scale feeds.",
  "Weekend hike was incredible — views for days.",
  "Thoughts on building accessible UI components.",
  "The championship game last night was unbelievable.",
  "Travel tip: always pack light and stay curious.",
  "New album drop — already on repeat.",
  "Debugging virtualization edge cases today.",
  "Morning routine changes that actually stick.",
  "Conference talk on frontend architecture was inspiring.",
  "Drafting ideas for a side project this week.",
  "Archived some old posts — spring cleaning time.",
];

function generatePosts(count: number): Post[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i + 1}`,
    author: authors[i % authors.length]!,
    content: contents[i % contents.length]!,
    category: CATEGORIES[i % CATEGORIES.length]!,
    status: STATUSES[i % STATUSES.length]!,
    createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
    likes: (i * 17) % 500,
    liked: i % 5 === 0,
  }));
}

const posts = generatePosts(TOTAL_POSTS);

export type QueryPostsInput = {
  page: number;
  limit: number;
  filters: {
    search: string;
    category: Category | "all";
    status: Status | "all";
    date: DateFilter;
  };
};

export function queryPosts({ page, limit, filters }: QueryPostsInput) {
  const filtered = filterPosts(posts, filters);
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 100));
  const start = (safePage - 1) * safeLimit;
  const pagePosts = filtered.slice(start, start + safeLimit);

  return {
    posts: pagePosts,
    total: filtered.length,
    page: safePage,
    limit: safeLimit,
    hasMore: start + pagePosts.length < filtered.length,
  };
}

export async function togglePostLike(
  postId: string,
  liked: boolean,
): Promise<{ id: string; liked: boolean; likes: number }> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const post = posts.find((p) => p.id === postId);
  if (!post) throw new Error("Post not found");

  if (Math.random() < 0.05) {
    throw new Error("Failed to update like. Please try again.");
  }

  post.liked = liked;
  post.likes = liked ? post.likes + 1 : Math.max(0, post.likes - 1);

  return { id: postId, liked: post.liked, likes: post.likes };
}

export const CATEGORIES = [
  "tech",
  "travel",
  "music",
  "sports",
  "food",
  "design",
] as const;

export const STATUSES = ["published", "draft", "archived", "scheduled"] as const;

export const DATE_FILTERS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Status = (typeof STATUSES)[number];
export type DateFilter = (typeof DATE_FILTERS)[number]["value"];

export type Post = {
  id: string;
  author: string;
  content: string;
  category: Category;
  status: Status;
  createdAt: string;
  likes: number;
  liked: boolean;
};

export type FeedFilters = {
  search: string;
  category: Category | "all";
  status: Status | "all";
  date: DateFilter;
};

export const DEFAULT_FILTERS: FeedFilters = {
  search: "",
  category: "all",
  status: "all",
  date: "all",
};

export const PAGE_SIZE = 50;

export type PostsPageResponse = {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

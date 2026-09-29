import type { FeedFilters, PostsPageResponse } from "../types/posts";
import { PAGE_SIZE } from "../types/posts";
import { feedFiltersToSearchParams } from "../utils/parse-feed-params";

export async function fetchPostsPage(
  filters: FeedFilters,
  page: number,
): Promise<PostsPageResponse> {
  const params = feedFiltersToSearchParams(filters);
  params.set("page", String(page));
  params.set("limit", String(PAGE_SIZE));

  const response = await fetch(`/api/posts?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load posts.");
  }

  return response.json();
}

export async function likePost(
  postId: string,
  liked: boolean,
): Promise<{ id: string; liked: boolean; likes: number }> {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liked }),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to update like.");
  }

  return response.json();
}

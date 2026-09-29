"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPostsPage } from "../services/api";
import { useFeedFilters } from "./use-feed-filters";

export const POSTS_QUERY_KEY = "posts";

export function usePosts() {
  const { filters } = useFeedFilters();

  const query = useInfiniteQuery({
    queryKey: [POSTS_QUERY_KEY, filters],
    queryFn: ({ pageParam }) => fetchPostsPage(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const posts = query.data?.pages.flatMap((page) => page.posts) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    ...query,
    posts,
    total,
    filters,
  };
}

"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, DateFilter, FeedFilters, Status } from "../types/posts";
import {
  feedFiltersToSearchParams,
  parseFeedFiltersFromSearchParams,
} from "../utils/parse-feed-params";

export function useFeedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: FeedFilters = useMemo(
    () => parseFeedFiltersFromSearchParams(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (updates: Partial<FeedFilters>) => {
      const next: FeedFilters = { ...filters, ...updates };
      const params = feedFiltersToSearchParams(next);
      const query = params.toString();
      router.replace(query ? `/feed?${query}` : "/feed", { scroll: false });
    },
    [filters, router],
  );

  const setSearch = useCallback(
    (search: string) => setFilters({ search }),
    [setFilters],
  );

  const setCategory = useCallback(
    (category: Category | "all") => setFilters({ category }),
    [setFilters],
  );

  const setStatus = useCallback(
    (status: Status | "all") => setFilters({ status }),
    [setFilters],
  );

  const setDate = useCallback(
    (date: DateFilter) => setFilters({ date }),
    [setFilters],
  );

  const clearFilters = useCallback(() => {
    router.replace("/feed", { scroll: false });
  }, [router]);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.date !== "all" ||
    filters.search.trim() !== "";

  return {
    filters,
    setFilters,
    setSearch,
    setCategory,
    setStatus,
    setDate,
    clearFilters,
    hasActiveFilters,
  };
}

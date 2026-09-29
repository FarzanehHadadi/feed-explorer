import type { Category, DateFilter, FeedFilters, Status } from "../types/posts";
import {
  CATEGORIES,
  DATE_FILTERS,
  DEFAULT_FILTERS,
  STATUSES,
} from "../types/posts";

function parseCategory(value: string | null): FeedFilters["category"] {
  if (!value || value === "all") return "all";
  const match = CATEGORIES.find((c) => c.toLowerCase() === value.toLowerCase());
  return match ?? "all";
}

function parseStatus(value: string | null): FeedFilters["status"] {
  if (!value || value === "all") return "all";
  const match = STATUSES.find((s) => s.toLowerCase() === value.toLowerCase());
  return match ?? "all";
}

function parseDate(value: string | null): DateFilter {
  const valid = DATE_FILTERS.map((d) => d.value);
  if (!value || value === "all") return "all";
  return valid.includes(value as DateFilter) ? (value as DateFilter) : "all";
}

export function parseFeedFiltersFromSearchParams(
  params: URLSearchParams,
): FeedFilters {
  return {
    search: params.get("q") ?? DEFAULT_FILTERS.search,
    category: parseCategory(params.get("category")),
    status: parseStatus(params.get("status")),
    date: parseDate(params.get("date")),
  };
}

export function feedFiltersToSearchParams(
  filters: FeedFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("q", filters.search.trim());
  }
  if (filters.category !== "all") {
    params.set("category", filters.category.toLowerCase());
  }
  if (filters.status !== "all") {
    params.set("status", filters.status.toLowerCase());
  }
  if (filters.date !== "all") {
    params.set("date", filters.date);
  }

  return params;
}

export function parseCategoryParam(value: string | null): Category | "all" {
  return parseCategory(value);
}

export function parseStatusParam(value: string | null): Status | "all" {
  return parseStatus(value);
}

export function parseDateParam(value: string | null): DateFilter {
  return parseDate(value);
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { debounce } from "@/utils/debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { SearchInput } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Category, DateFilter, FeedFilters, Status } from "../types/posts";
import { CATEGORIES, DATE_FILTERS, STATUSES } from "../types/posts";

type FeedToolbarProps = {
  filters: FeedFilters;
  total: number;
  hasActiveFilters: boolean;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: Category | "all") => void;
  onStatusChange: (status: Status | "all") => void;
  onDateChange: (date: DateFilter) => void;
  onClear: () => void;
};

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

export function FeedToolbar({
  filters,
  total,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onDateChange,
  onClear,
}: FeedToolbarProps) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const debouncedOnSearchChange = useMemo(
    () => debounce(onSearchChange, 300),
    [onSearchChange],
  );

  useEffect(
    () => () => debouncedOnSearchChange.cancel(),
    [debouncedOnSearchChange],
  );

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setLocalSearch(filters.search);
    }
    setOpen(next);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    debouncedOnSearchChange(value);
  };

  const handleClear = () => {
    debouncedOnSearchChange.cancel();
    setLocalSearch("");
    onClear();
  };

  const activeLabels = [
    filters.search.trim() ? `"${filters.search.trim()}"` : null,
    filters.category !== "all" ? filters.category : null,
    filters.status !== "all" ? filters.status : null,
    filters.date !== "all"
      ? DATE_FILTERS.find((d) => d.value === filters.date)?.label
      : null,
  ].filter(Boolean);

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      panelId="feed-toolbar-panel"
      ariaLabel="Search and filter posts"
      className="shrink-0"
      trigger={
        <>
          <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(!open)}
              aria-expanded={open}
              aria-controls="feed-toolbar-panel"
              aria-haspopup="dialog"
              className="h-auto flex-1 justify-start gap-2 px-2 py-1.5 text-left font-medium text-text-primary"
            >
              <SearchIcon />
              <span className="truncate">
                {hasActiveFilters
                  ? "Search & filters active"
                  : "Search & filter posts"}
              </span>
              <svg
                className={`ml-auto h-4 w-4 shrink-0 text-text-icon transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>

            <span className="hidden text-xs text-text-muted sm:inline">
              {total.toLocaleString()} results
            </span>
          </div>

          {hasActiveFilters && !open && activeLabels.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeLabels.map((label) => (
                <Badge key={label} variant="info">
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </>
      }
    >
      <div className="border-b border-border-muted px-4 py-3">
        <label htmlFor="toolbar-search" className="sr-only">
          Search posts
        </label>
        <SearchInput
          id="toolbar-search"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search author or content…"
          autoComplete="off"
          icon={<SearchIcon />}
        />
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        <Select
          id="toolbar-category"
          label="Category"
          value={filters.category}
          options={[
            { value: "all" as const, label: "All" },
            ...CATEGORIES.map((c) => ({ value: c, label: c })),
          ]}
          onChange={onCategoryChange}
        />
        <Select
          id="toolbar-status"
          label="Status"
          value={filters.status}
          options={[
            { value: "all" as const, label: "All" },
            ...STATUSES.map((s) => ({ value: s, label: s })),
          ]}
          onChange={onStatusChange}
        />
        <Select
          id="toolbar-date"
          label="Date"
          value={filters.date}
          options={DATE_FILTERS.map((d) => ({
            value: d.value,
            label: d.label,
          }))}
          onChange={onDateChange}
        />
      </div>

      <div className="flex items-center justify-end border-t border-border-muted px-4 py-3">
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear all
            </Button>
          )}
          <Button size="sm" onClick={() => handleOpenChange(false)}>
            Done
          </Button>
        </div>
      </div>
    </Dropdown>
  );
}

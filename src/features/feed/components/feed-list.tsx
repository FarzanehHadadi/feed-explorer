"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button } from "@/components/ui/button";
import { usePosts } from "../hooks/use-posts";
import type { Post } from "../types/posts";
import { PostCard } from "./post-card";
import { FeedSkeletonList } from "./post-skeleton";

const ESTIMATED_ITEM_HEIGHT = 168;
const LIST_GAP = 16;
const LIST_END_MARGIN = 32;

function LoadingProgressBar() {
  return (
    <div
      className="shrink-0 pt-3"
      role="progressbar"
      aria-label="Loading more posts"
      aria-busy="true"
    >
      <div className="h-1.5 overflow-hidden rounded-full bg-skeleton">
        <div className="loading-bar-indeterminate h-full w-1/3 rounded-full bg-accent" />
      </div>
    </div>
  );
}

type VirtualizedFeedProps = {
  posts: Post[];
  resetKey: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

function VirtualizedFeed({
  posts,
  resetKey,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: VirtualizedFeedProps) {
  "use no memo";

  const parentRef = useRef<HTMLDivElement>(null);
  const loadTriggeredRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    overscan: 5,
    gap: LIST_GAP,
    paddingEnd: LIST_END_MARGIN,
    onChange: (instance) => {
      if (!hasNextPage || isFetchingNextPage || loadTriggeredRef.current)
        return;

      const items = instance.getVirtualItems();
      const lastItem = items[items.length - 1];
      if (!lastItem || lastItem.index < posts.length - 1) return;

      loadTriggeredRef.current = true;
      fetchNextPage();
    },
  });

  useEffect(() => {
    loadTriggeredRef.current = false;
    parentRef.current?.scrollTo({ top: 0 });
  }, [resetKey]);

  useEffect(() => {
    if (!isFetchingNextPage) {
      loadTriggeredRef.current = false;
    }
  }, [isFetchingNextPage]);

  useEffect(() => {
    const el = parentRef.current;
    if (!el || !hasNextPage || isFetchingNextPage || loadTriggeredRef.current)
      return;

    if (el.scrollHeight <= el.clientHeight) {
      loadTriggeredRef.current = true;
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, posts.length]);

  return (
    <div className={`flex min-h-0 flex-1 flex-col `}>
      <div
        ref={parentRef}
        className="scrollbar-hide min-h-0 flex-1 overflow-y-auto"
        role="feed"
        aria-label="Social feed posts"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const post = posts[virtualItem.index];
            if (!post) return null;

            return (
              <div
                key={post.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <PostCard post={post} />
              </div>
            );
          })}
        </div>
      </div>

      {isFetchingNextPage && <LoadingProgressBar />}
    </div>
  );
}

export function FeedList() {
  const {
    posts,
    filters,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePosts();

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <FeedSkeletonList count={8} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="rounded-xl border border-error-border bg-error-surface p-6 text-center"
          role="alert"
        >
          <p className="mb-1 font-medium text-error-heading">
            Something went wrong.
          </p>
          <p className="mb-4 text-sm text-error-body">
            {error instanceof Error ? error.message : "Failed to load posts."}
          </p>
          <Button
            variant="danger"
            onClick={() => refetch()}
            disabled={isFetching}
            className="focus-visible:outline-red-500"
          >
            {isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border-dashed bg-surface-empty px-6 py-16 text-center"
        role="status"
      >
        <p className="mb-1 text-base font-medium text-text-primary">
          No posts found.
        </p>
        <p className="text-sm text-text-muted">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <VirtualizedFeed
      posts={posts}
      resetKey={JSON.stringify(filters)}
      hasNextPage={hasNextPage ?? false}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={() => fetchNextPage()}
    />
  );
}

import { Suspense } from "react";
import { FeedExplorer } from "@/features/feed/components/feed-explorer";
import { FeedSkeletonList } from "@/features/feed/components/post-skeleton";

export const metadata = {
  title: "Social Feed Explorer",
  description: "Browse, search, and filter a large social feed with virtualization.",
};

export default function FeedPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<FeedPageSkeleton />}>
        <FeedExplorer />
      </Suspense>
    </div>
  );
}

function FeedPageSkeleton() {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-5 overflow-hidden px-4 py-6 sm:px-6">
      <div className="h-8 w-48 animate-pulse rounded bg-skeleton" />
      <div className="h-12 animate-pulse rounded-xl bg-skeleton" />
      <FeedSkeletonList count={6} />
    </div>
  );
}

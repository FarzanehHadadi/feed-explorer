export function PostSkeleton() {
  return (
    <article
      className="animate-pulse rounded-xl border border-border-subtle bg-surface p-5"
      aria-hidden="true"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="h-4 w-32 rounded bg-skeleton" />
        <div className="h-5 w-20 rounded-full bg-skeleton" />
      </div>
      <div className="mb-2 h-3 w-full rounded bg-skeleton" />
      <div className="mb-4 h-3 w-4/5 rounded bg-skeleton" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-skeleton" />
        <div className="h-8 w-16 rounded-full bg-skeleton" />
      </div>
    </article>
  );
}

export function FeedSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading posts">
      {Array.from({ length: count }, (_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

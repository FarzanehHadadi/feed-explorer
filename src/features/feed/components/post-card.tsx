"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Post } from "../types/posts";
import { formatPostDate } from "../../../utils/format-date";
import { useLikePost } from "../hooks/use-like-post";

type PostCardProps = {
  post: Post;
};

const statusStyles: Record<Post["status"], string> = {
  published: "bg-status-published-bg text-status-published-fg",
  draft: "bg-status-draft-bg text-status-draft-fg",
  archived: "bg-status-archived-bg text-status-archived-fg",
  scheduled: "bg-status-scheduled-bg text-status-scheduled-fg",
};

export function PostCard({ post }: PostCardProps) {
  const likeMutation = useLikePost();
  const [likeError, setLikeError] = useState<string | null>(null);

  const handleLike = () => {
    setLikeError(null);
    likeMutation.mutate(
      { postId: post.id, liked: !post.liked },
      {
        onError: (error) => {
          setLikeError(
            error instanceof Error ? error.message : "Could not update like.",
          );
        },
      },
    );
  };

  return (
    <article className="rounded-xl border border-border-subtle bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-text-primary">
            {post.author}
          </h2>
          <span className="rounded-full bg-badge px-2 py-0.5 text-xs font-medium text-badge-fg">
            {post.category}
          </span>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[post.status]}`}
        >
          {post.status}
        </span>
      </header>

      <p className="mb-4 text-sm leading-relaxed text-text-secondary">
        {post.content}
      </p>

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <time className="text-xs text-text-muted" dateTime={post.createdAt}>
          {formatPostDate(post.createdAt)}
        </time>

        <div className="flex items-center gap-2">
          {likeError && (
            <span className="text-xs text-text-danger" role="alert">
              {likeError}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            aria-pressed={post.liked}
            aria-label={post.liked ? "Unlike post" : "Like post"}
            className="gap-1.5 rounded-full"
          >
            <span aria-hidden="true">{post.liked ? "♥" : "♡"}</span>
            <span>{post.likes}</span>
          </Button>
        </div>
      </footer>
    </article>
  );
}

"use client";

import { FeedTopToolbar } from "./feed-top-toolbar";
import { FeedList } from "./feed-list";

export function FeedExplorer() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col gap-3 overflow-hidden px-4 py-4 sm:px-6">
      <FeedTopToolbar />
      <FeedList />
    </div>
  );
}

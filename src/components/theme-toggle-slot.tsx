"use client";

import dynamic from "next/dynamic";

export const ThemeToggle = dynamic(
  () => import("./theme-toggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <span className="inline-block h-8 w-8" aria-hidden="true" />
    ),
  },
);

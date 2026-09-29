"use client";

import { useState } from "react";
import { MoonOutlineIcon, SunOutlineIcon } from "@/components/ui/icons";
import { getStoredTheme, setStoredTheme, type Theme } from "@/utils/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setStoredTheme(next);
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
    >
      {isDark ? <SunOutlineIcon /> : <MoonOutlineIcon />}
    </button>
  );
}

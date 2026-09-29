import Link from "next/link";
import { AppIcon } from "@/components/app-icon";
import { ThemeToggle } from "@/components/theme-toggle-slot";

export function SiteHeader() {
  return (
    <header className="shrink-0 border-b border-border-subtle bg-page">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <AppIcon className="h-7 w-7" />
          Feed Explorer
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

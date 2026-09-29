import type { Metadata } from "next";
import { QueryProvider } from "@/providers/query-provider";
import { SiteHeader } from "@/components/site-header";
import { themeInitScript, themeInitStyles } from "@/utils/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Feed Explorer",
  description:
    "Browse, search, and filter a large social feed with virtualization.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <style dangerouslySetInnerHTML={{ __html: themeInitStyles }} />
      </head>
      <body className="flex h-full flex-col overflow-hidden bg-page text-text-primary">
        <QueryProvider>
          <SiteHeader />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}

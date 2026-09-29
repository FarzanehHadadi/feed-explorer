import { NextRequest, NextResponse } from "next/server";
import { queryPosts } from "@/utils/mock-data";
import { parseFeedFiltersFromSearchParams } from "@/features/feed/utils/parse-feed-params";
import { PAGE_SIZE } from "@/features/feed/types/posts";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Number.parseInt(
    searchParams.get("limit") ?? String(PAGE_SIZE),
    10,
  );
  const filters = parseFeedFiltersFromSearchParams(searchParams);

  // Simulate network latency to make loading states observable during development.
  await new Promise((resolve) => setTimeout(resolve, page === 1 ? 600 : 450));

  const result = queryPosts({
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : PAGE_SIZE,
    filters,
  });

  return NextResponse.json(result);
}

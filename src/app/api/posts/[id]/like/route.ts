import { NextRequest, NextResponse } from "next/server";
import { togglePostLike } from "@/utils/mock-data";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as { liked?: boolean };

  if (typeof body.liked !== "boolean") {
    return NextResponse.json({ error: "Invalid liked value" }, { status: 400 });
  }

  try {
    const result = await togglePostLike(id, body.liked);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update like.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

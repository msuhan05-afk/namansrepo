import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/content";

export const runtime = "nodejs";

export async function GET() {
  const content = getPortfolioContent();
  return NextResponse.json(content);
}

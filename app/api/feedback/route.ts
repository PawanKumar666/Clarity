import { NextResponse } from "next/server";
import { prisma, getDemoUserId } from "@/app/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const insightId = String(body.insightId ?? "");
  const rating = body.rating === "accurate" ? "accurate" : "inaccurate";
  const type = body.type === "weekly" || body.type === "subscription" ? body.type : "daily";

  if (!insightId) {
    return NextResponse.json({ error: "Missing insightId" }, { status: 400 });
  }

  const userId = await getDemoUserId();
  await prisma.feedback.create({
    data: {
      userId,
      insightId,
      type,
      rating
    }
  });

  return NextResponse.json({ ok: true });
}

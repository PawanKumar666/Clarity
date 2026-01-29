import { NextResponse } from "next/server";
import { prisma, getDemoUserId } from "@/app/lib/db";

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("dev") !== "1") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const userId = await getDemoUserId();
  await prisma.feedback.deleteMany({ where: { userId } });
  await prisma.insight.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  return NextResponse.json({ ok: true });
}

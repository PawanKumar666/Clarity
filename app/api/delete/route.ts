import { NextResponse } from "next/server";
import { prisma, getDemoUserId } from "@/app/lib/db";

export async function POST() {
  const userId = await getDemoUserId();
  await prisma.feedback.deleteMany({ where: { userId } });
  await prisma.insight.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  return NextResponse.json({ ok: true });
}

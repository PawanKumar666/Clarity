import { NextResponse } from "next/server";
import { recomputeInsights } from "@/app/lib/ingest";

export async function POST() {
  await recomputeInsights();
  return NextResponse.json({ ok: true });
}

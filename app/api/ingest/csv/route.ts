import { NextResponse } from "next/server";
import { parseCsvText } from "@/app/lib/parse";
import { ingestTransactions } from "@/app/lib/ingest";

export async function POST(request: Request) {
  const body = await request.json();
  const text = String(body.text ?? "");
  const parsed = parseCsvText(text, new Date());

  if (parsed.length === 0) {
    return NextResponse.json({ created: 0, skipped: 0, failed: 0 });
  }

  const result = await ingestTransactions(parsed);
  return NextResponse.json({
    created: result.createdCount,
    skipped: result.skippedCount,
    failed: 0
  });
}

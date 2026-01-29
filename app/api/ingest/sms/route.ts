import { NextResponse } from "next/server";
import { parseSmsLine } from "@/app/lib/parse";
import { ingestTransactions } from "@/app/lib/ingest";

export async function POST(request: Request) {
  const body = await request.json();
  const text = String(body.text ?? "");
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const fallbackDate = new Date();

  const parsed = lines
    .map((line) => {
      const txn = parseSmsLine(line, fallbackDate);
      if (!txn) {
        console.warn("Failed to parse SMS line", line);
      }
      return txn;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const result = await ingestTransactions(parsed);
  return NextResponse.json({
    created: result.createdCount,
    skipped: result.skippedCount,
    failed: lines.length - parsed.length
  });
}

import { startOfDay } from "date-fns";
import { prisma, getDemoUserId } from "./db";
import type { ParsedTransaction } from "./parse";
import { buildInsights } from "./insights";

export async function ingestTransactions(parsed: ParsedTransaction[]) {
  const userId = await getDemoUserId();
  const created: ParsedTransaction[] = [];
  const skipped: ParsedTransaction[] = [];

  const dedupeKeys = new Set<string>();

  for (const txn of parsed) {
    const day = startOfDay(txn.date);
    const key = `${txn.amount}-${txn.merchantClean}-${day.toISOString()}-${txn.referenceId ?? ""}`;
    if (dedupeKeys.has(key)) {
      skipped.push(txn);
      continue;
    }
    dedupeKeys.add(key);

    const existing = await prisma.transaction.findFirst({
      where: {
        userId,
        amount: txn.amount,
        merchantClean: txn.merchantClean,
        referenceId: txn.referenceId ?? undefined,
        date: {
          gte: day,
          lt: new Date(day.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (existing) {
      skipped.push(txn);
      continue;
    }

    await prisma.transaction.create({
      data: {
        userId,
        date: txn.date,
        amount: txn.amount,
        currency: txn.currency,
        method: txn.method,
        merchantRaw: txn.merchantRaw,
        merchantClean: txn.merchantClean,
        inferredCategory: txn.inferredCategory,
        referenceId: txn.referenceId,
        rawText: txn.rawText
      }
    });
    created.push(txn);
  }

  await recomputeInsights();

  return { createdCount: created.length, skippedCount: skipped.length };
}

export async function recomputeInsights() {
  const userId = await getDemoUserId();
  const txns = await prisma.transaction.findMany({ where: { userId } });
  const insights = buildInsights(txns);

  await prisma.insight.deleteMany({ where: { userId } });

  await prisma.insight.createMany({
    data: insights.map((insight) => ({
      userId,
      dateRangeStart: insight.dateRangeStart,
      dateRangeEnd: insight.dateRangeEnd,
      type: insight.type,
      text: insight.text,
      metadata: insight.metadata
    }))
  });
}

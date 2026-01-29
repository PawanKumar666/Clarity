import { addDays, differenceInCalendarDays, isSameDay, startOfDay, subDays } from "date-fns";
import type { Transaction } from "@prisma/client";

export type InsightPayload = {
  type: "daily" | "weekly" | "subscription";
  text: string;
  dateRangeStart: Date;
  dateRangeEnd: Date;
  metadata: Record<string, unknown>;
};

export function buildInsights(transactions: Transaction[]): InsightPayload[] {
  if (transactions.length === 0) {
    const today = startOfDay(new Date());
    return [
      {
        type: "daily",
        text: "No transactions yet. Add a few to see today’s clarity.",
        dateRangeStart: today,
        dateRangeEnd: today,
        metadata: {}
      },
      {
        type: "weekly",
        text: "Not enough data for a weekly drift yet.",
        dateRangeStart: today,
        dateRangeEnd: today,
        metadata: {}
      },
      {
        type: "subscription",
        text: "No recurring charges spotted yet.",
        dateRangeStart: today,
        dateRangeEnd: today,
        metadata: { subscriptions: [] }
      }
    ];
  }

  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const mostRecentDate = sorted[sorted.length - 1].date;
  const daily = buildDailyInsight(sorted, mostRecentDate);
  const weekly = buildWeeklyInsight(sorted, mostRecentDate);
  const subscription = buildSubscriptionInsight(sorted, mostRecentDate);

  return [daily, weekly, subscription];
}

function buildDailyInsight(transactions: Transaction[], targetDate: Date): InsightPayload {
  const dayStart = startOfDay(targetDate);
  const dayTransactions = transactions.filter((txn) => isSameDay(txn.date, dayStart));
  const positiveTxns = dayTransactions.filter((txn) => txn.amount > 0);
  const categoryTotals = new Map<string, number>();
  positiveTxns.forEach((txn) => {
    categoryTotals.set(
      txn.inferredCategory,
      (categoryTotals.get(txn.inferredCategory) ?? 0) + txn.amount
    );
  });

  const sortedCategories = Array.from(categoryTotals.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  let text = "You didn’t spend much today.";
  if (positiveTxns.length <= 2 && sortedCategories.length > 0) {
    text = `You only spent on ${sortedCategories[0][0].toLowerCase()} today — looks like a light day.`;
  } else if (sortedCategories.length >= 1) {
    const topOne = sortedCategories[0][0].toLowerCase();
    const topTwo = sortedCategories[1]?.[0].toLowerCase();
    text = topTwo
      ? `Most of your spending today went on ${topOne} and ${topTwo}.`
      : `Most of your spending today went on ${topOne}.`;
  }

  return {
    type: "daily",
    text,
    dateRangeStart: dayStart,
    dateRangeEnd: dayStart,
    metadata: {
      transactionCount: dayTransactions.length,
      categories: sortedCategories
    }
  };
}

function buildWeeklyInsight(transactions: Transaction[], anchorDate: Date): InsightPayload {
  const end = startOfDay(anchorDate);
  const start = subDays(end, 6);
  const previousStart = subDays(start, 7);
  const previousEnd = subDays(start, 1);

  const currentWeek = transactions.filter(
    (txn) => txn.date >= start && txn.date <= end && txn.amount > 0
  );
  const previousWeek = transactions.filter(
    (txn) => txn.date >= previousStart && txn.date <= previousEnd && txn.amount > 0
  );

  if (currentWeek.length < 3 || previousWeek.length < 2) {
    return {
      type: "weekly",
      text: "Not enough data for a weekly drift yet.",
      dateRangeStart: start,
      dateRangeEnd: end,
      metadata: {}
    };
  }

  const currentTotal = sumAmounts(currentWeek);
  const previousTotal = sumAmounts(previousWeek);
  const diff = currentTotal - previousTotal;

  const topCategory = topCategoryBySpend(currentWeek);

  let text = "Your spending stayed steady this week.";
  if (diff > 0) {
    text = `This week you spent ₹${Math.round(diff)} more than usual — mainly on ${topCategory.toLowerCase()}.`;
  } else if (diff < 0) {
    text = `This week you spent ₹${Math.round(Math.abs(diff))} less than usual — a calmer week overall.`;
  }

  return {
    type: "weekly",
    text,
    dateRangeStart: start,
    dateRangeEnd: end,
    metadata: {
      currentTotal,
      previousTotal,
      topCategory
    }
  };
}

function buildSubscriptionInsight(transactions: Transaction[], anchorDate: Date): InsightPayload {
  const byMerchant = new Map<string, Transaction[]>();
  transactions
    .filter((txn) => txn.amount > 0)
    .forEach((txn) => {
      const list = byMerchant.get(txn.merchantClean) ?? [];
      list.push(txn);
      byMerchant.set(txn.merchantClean, list);
    });

  const subscriptions = Array.from(byMerchant.entries())
    .map(([merchant, txns]) => detectSubscription(merchant, txns, anchorDate))
    .filter((item) => item !== null);

  const text = subscriptions.length
    ? "These merchants look like recurring charges."
    : "No recurring charges spotted yet.";

  return {
    type: "subscription",
    text,
    dateRangeStart: subDays(startOfDay(anchorDate), 60),
    dateRangeEnd: startOfDay(anchorDate),
    metadata: { subscriptions }
  };
}

function detectSubscription(
  merchant: string,
  txns: Transaction[],
  anchorDate: Date
): null | {
  merchant: string;
  recurrence: "monthly" | "weekly";
  amountRange: string;
  lastCharged: string;
  status: string;
} {
  const sorted = [...txns].sort((a, b) => a.date.getTime() - b.date.getTime());
  if (sorted.length < 2) return null;

  const gaps = sorted
    .slice(1)
    .map((txn, idx) => differenceInCalendarDays(txn.date, sorted[idx].date));

  const isMonthly = gaps.some((gap) => gap >= 25 && gap <= 35);
  const isWeekly = gaps.some((gap) => gap >= 6 && gap <= 8);

  if (!isMonthly && !isWeekly) return null;

  const amounts = sorted.map((txn) => txn.amount);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const last = sorted[sorted.length - 1].date;
  const daysSince = differenceInCalendarDays(startOfDay(anchorDate), startOfDay(last));

  let status = "Active";
  if (isMonthly && daysSince > 40) {
    status = `Possibly inactive · haven’t seen a charge in ${daysSince} days`;
  } else {
    status = `Last charged ${daysSince} days ago`;
  }

  return {
    merchant,
    recurrence: isMonthly ? "monthly" : "weekly",
    amountRange: `₹${Math.round(min)}–₹${Math.round(max)}`,
    lastCharged: last.toISOString(),
    status
  };
}

function sumAmounts(txns: Transaction[]): number {
  return txns.reduce((sum, txn) => sum + txn.amount, 0);
}

function topCategoryBySpend(txns: Transaction[]): string {
  const map = new Map<string, number>();
  txns.forEach((txn) => {
    map.set(txn.inferredCategory, (map.get(txn.inferredCategory) ?? 0) + txn.amount);
  });
  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "Other";
}

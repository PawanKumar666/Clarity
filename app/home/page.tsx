import Link from "next/link";
import { prisma, getDemoUserId } from "@/app/lib/db";
import InsightCard from "@/app/components/InsightCard";
import TransactionFeed from "@/app/components/TransactionFeed";
import { formatDateLabel } from "@/app/lib/parse";

export default async function HomePage() {
  const userId = await getDemoUserId();
  const [transactions, insights] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    }),
    prisma.insight.findMany({ where: { userId } })
  ]);

  const insightMap = new Map(insights.map((item) => [item.type, item]));
  const daily = insightMap.get("daily");
  const weekly = insightMap.get("weekly");
  const subscription = insightMap.get("subscription");

  const subscriptionList =
    (subscription?.metadata as { subscriptions?: Array<Record<string, string>> })
      ?.subscriptions ?? [];

  return (
    <main className="container space-y-6 pb-16 pt-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Clarity dashboard
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Your spending story, simplified.
          </h1>
        </div>
        <Link className="button-outline" href="/onboarding">
          Add more data
        </Link>
      </header>

      <InsightCard
        id={daily?.id}
        title="Today’s insight"
        text={daily?.text ?? "Add data to see today’s clarity."}
        type="daily"
      />

      <InsightCard
        id={weekly?.id}
        title="This week changed…"
        text={weekly?.text ?? "Not enough data yet to compare weeks."}
        type="weekly"
      />

      <div className="card space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Subscription watchlist
          </p>
          <p className="mt-2 text-lg font-medium text-slate-900">
            {subscription?.text ?? "No recurring charges yet."}
          </p>
        </div>
        {subscriptionList.length === 0 ? (
          <p className="text-sm text-slate-500">
            Once a merchant repeats monthly or weekly, it will show up here.
          </p>
        ) : (
          <div className="space-y-3">
            {subscriptionList.map((item) => (
              <div
                key={`${item.merchant}-${item.lastCharged}`}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.merchant}</p>
                  <p className="text-xs text-slate-500">{item.status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge">{item.recurrence}</span>
                  <span className="text-sm text-slate-700">{item.amountRange}</span>
                  <span className="text-xs text-slate-500">
                    {formatDateLabel(new Date(item.lastCharged))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <InsightCard
          id={subscription?.id}
          title="Was this accurate?"
          text="Help refine the watchlist by rating it."
          type="subscription"
        />
      </div>

      <TransactionFeed
        transactions={transactions.map((txn) => ({
          id: txn.id,
          date: txn.date.toISOString(),
          amount: txn.amount,
          method: txn.method,
          merchantClean: txn.merchantClean,
          merchantRaw: txn.merchantRaw
        }))}
      />
    </main>
  );
}

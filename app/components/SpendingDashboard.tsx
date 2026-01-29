"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { format } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const initialEntries = [
  {
    id: "txn-1",
    date: "2024-08-01",
    merchant: "Blinkit",
    category: "Groceries",
    amount: 1180,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-2",
    date: "2024-08-02",
    merchant: "IndiGo",
    category: "Travel",
    amount: 6450,
    method: "Card",
    city: "Bengaluru"
  },
  {
    id: "txn-3",
    date: "2024-08-03",
    merchant: "Swiggy",
    category: "Dining",
    amount: 520,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-4",
    date: "2024-08-05",
    merchant: "Cult Fit",
    category: "Health",
    amount: 1899,
    method: "Card",
    city: "Bengaluru"
  },
  {
    id: "txn-5",
    date: "2024-08-06",
    merchant: "Netflix",
    category: "Subscriptions",
    amount: 649,
    method: "Card",
    city: "Bengaluru"
  },
  {
    id: "txn-6",
    date: "2024-08-08",
    merchant: "Zomato",
    category: "Dining",
    amount: 740,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-7",
    date: "2024-08-10",
    merchant: "Uber",
    category: "Transport",
    amount: 410,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-8",
    date: "2024-08-12",
    merchant: "Amazon",
    category: "Shopping",
    amount: 2599,
    method: "Card",
    city: "Bengaluru"
  },
  {
    id: "txn-9",
    date: "2024-08-14",
    merchant: "Tata Power",
    category: "Utilities",
    amount: 1220,
    method: "NetBanking",
    city: "Bengaluru"
  },
  {
    id: "txn-10",
    date: "2024-08-16",
    merchant: "IRCTC",
    category: "Travel",
    amount: 2250,
    method: "Card",
    city: "Chennai"
  },
  {
    id: "txn-11",
    date: "2024-08-18",
    merchant: "BigBasket",
    category: "Groceries",
    amount: 1525,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-12",
    date: "2024-08-20",
    merchant: "Croma",
    category: "Electronics",
    amount: 8999,
    method: "Card",
    city: "Chennai"
  },
  {
    id: "txn-13",
    date: "2024-08-22",
    merchant: "FreshToHome",
    category: "Groceries",
    amount: 980,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-14",
    date: "2024-08-24",
    merchant: "BookMyShow",
    category: "Entertainment",
    amount: 1250,
    method: "Card",
    city: "Chennai"
  },
  {
    id: "txn-15",
    date: "2024-08-26",
    merchant: "Apollo Pharmacy",
    category: "Health",
    amount: 680,
    method: "UPI",
    city: "Bengaluru"
  },
  {
    id: "txn-16",
    date: "2024-08-28",
    merchant: "Reliance Digital",
    category: "Shopping",
    amount: 4490,
    method: "Card",
    city: "Hyderabad"
  },
  {
    id: "txn-17",
    date: "2024-08-29",
    merchant: "Postpaid",
    category: "Utilities",
    amount: 799,
    method: "NetBanking",
    city: "Bengaluru"
  },
  {
    id: "txn-18",
    date: "2024-08-30",
    merchant: "Starbucks",
    category: "Dining",
    amount: 360,
    method: "UPI",
    city: "Bengaluru"
  }
];

type SpendingEntry = typeof initialEntries[number];

type NewEntry = {
  date: string;
  merchant: string;
  category: string;
  amount: string;
  method: string;
  city: string;
};

const defaultFormState: NewEntry = {
  date: "",
  merchant: "",
  category: "",
  amount: "",
  method: "UPI",
  city: ""
};

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export default function SpendingDashboard() {
  const [entries, setEntries] = useState<SpendingEntry[]>(initialEntries);
  const [formState, setFormState] = useState<NewEntry>(defaultFormState);

  const summary = useMemo(() => {
    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const uniqueDays = new Set(entries.map((entry) => entry.date)).size || 1;
    const dailyAverage = total / uniqueDays;

    const byCategory = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + entry.amount;
      return acc;
    }, {});

    const byMethod = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.method] = (acc[entry.method] ?? 0) + entry.amount;
      return acc;
    }, {});

    const byCity = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.city] = (acc[entry.city] ?? 0) + entry.amount;
      return acc;
    }, {});

    const byMerchant = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.merchant] = (acc[entry.merchant] ?? 0) + entry.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const topMerchant = Object.entries(byMerchant).sort((a, b) => b[1] - a[1])[0];
    const largestPurchase = entries.reduce((largest, entry) =>
      entry.amount > largest.amount ? entry : largest
    );

    const weeklyTotals = entries.reduce<Record<number, number>>((acc, entry) => {
      const date = new Date(entry.date);
      const week = Math.floor((date.getDate() - 1) / 7) + 1;
      acc[week] = (acc[week] ?? 0) + entry.amount;
      return acc;
    }, {});

    const weekValues = [1, 2, 3, 4, 5]
      .map((week) => ({
        week,
        value: weeklyTotals[week] ?? 0
      }))
      .filter((item) => item.value > 0);

    return {
      total,
      dailyAverage,
      byCategory,
      byMethod,
      byCity,
      topCategory,
      topMerchant,
      largestPurchase,
      weekValues
    };
  }, [entries]);

  const insights = useMemo(() => {
    const total = summary.total || 1;
    const [topCategoryName, topCategoryValue] = summary.topCategory ?? ["--", 0];
    const [topMerchantName, topMerchantValue] = summary.topMerchant ?? ["--", 0];
    const methodEntries = Object.entries(summary.byMethod).sort((a, b) => b[1] - a[1]);
    const topMethod = methodEntries[0];
    const projected = summary.dailyAverage * 30;

    return [
      `Top category is ${topCategoryName}, contributing ${(
        (topCategoryValue / total) * 100
      ).toFixed(1)}% of spend.`,
      `Highest-value merchant is ${topMerchantName} at ${formatCurrency(topMerchantValue)}.`,
      topMethod
        ? `${topMethod[0]} drives ${((topMethod[1] / total) * 100).toFixed(1)}% of payments.`
        : "Payment mix will show here as you add entries.",
      `Largest purchase was ${summary.largestPurchase.merchant} on ${format(
        new Date(summary.largestPurchase.date),
        "dd MMM"
      )} for ${formatCurrency(summary.largestPurchase.amount)}.`,
      `Projected monthly outflow at this pace: ${formatCurrency(projected)}.`
    ];
  }, [summary]);

  const categoryRows = useMemo(() => {
    return Object.entries(summary.byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([category, value]) => ({
        category,
        value,
        percent: summary.total ? (value / summary.total) * 100 : 0
      }));
  }, [summary]);

  const methodRows = useMemo(() => {
    return Object.entries(summary.byMethod)
      .sort((a, b) => b[1] - a[1])
      .map(([method, value]) => ({
        method,
        value,
        percent: summary.total ? (value / summary.total) * 100 : 0
      }));
  }, [summary]);

  const cityRows = useMemo(() => {
    return Object.entries(summary.byCity)
      .sort((a, b) => b[1] - a[1])
      .map(([city, value]) => ({
        city,
        value,
        percent: summary.total ? (value / summary.total) * 100 : 0
      }));
  }, [summary]);

  const maxCategoryValue = Math.max(...categoryRows.map((row) => row.value), 1);
  const maxWeekValue = Math.max(...summary.weekValues.map((row) => row.value), 1);
  const maxCityValue = Math.max(...cityRows.map((row) => row.value), 1);

  function handleChange(field: keyof NewEntry, value: string) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.date || !formState.merchant || !formState.category || !formState.amount) {
      return;
    }

    const amountValue = Number(formState.amount);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }

    const newEntry: SpendingEntry = {
      id: crypto.randomUUID(),
      date: formState.date,
      merchant: formState.merchant,
      category: formState.category,
      amount: amountValue,
      method: formState.method || "UPI",
      city: formState.city || "Remote"
    };

    setEntries((prev) => [newEntry, ...prev]);
    setFormState(defaultFormState);
  }

  function handleReset() {
    setEntries(initialEntries);
    setFormState(defaultFormState);
  }

  return (
    <section className="space-y-10">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total outflow
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.total)}
          </p>
          <p className="text-xs text-slate-500">18 transactions · Aug 2024</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Avg per active day
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.dailyAverage)}
          </p>
          <p className="text-xs text-slate-500">Daily pulse for your month</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top category
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {summary.topCategory?.[0] ?? "--"}
          </p>
          <p className="text-xs text-slate-500">
            {summary.topCategory
              ? `${formatCurrency(summary.topCategory[1])} this month`
              : "Add data to see"}
          </p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            High-value merchant
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {summary.topMerchant?.[0] ?? "--"}
          </p>
          <p className="text-xs text-slate-500">
            {summary.topMerchant
              ? `${formatCurrency(summary.topMerchant[1])} total`
              : "Add data to see"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category composition
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Spending mix across the month
            </h2>
          </div>
          <div className="space-y-4">
            {categoryRows.map((row) => (
              <div key={row.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{row.category}</span>
                  <span className="text-slate-600">
                    {formatCurrency(row.value)} · {row.percent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${(row.value / maxCategoryValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Weekly trend
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Spikes & dips across weeks
            </h2>
          </div>
          <div className="flex items-end gap-4">
            {summary.weekValues.map((row) => (
              <div key={row.week} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-xl bg-slate-900"
                    style={{ height: `${(row.value / maxWeekValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">Week {row.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Payment channels
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Where the money moved
            </h2>
          </div>
          <div className="space-y-3">
            {methodRows.map((row) => (
              <div
                key={row.method}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{row.method}</p>
                  <p className="text-xs text-slate-500">{row.percent.toFixed(1)}%</p>
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {formatCurrency(row.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Spend map
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Mapping out your city footprint
            </h2>
          </div>
          <div className="space-y-4">
            {cityRows.map((row) => (
              <div key={row.city} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-900">{row.city}</span>
                  <span className="text-slate-600">
                    {formatCurrency(row.value)} · {row.percent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-500"
                    style={{ width: `${(row.value / maxCityValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              LLM-generated insights
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              The narrative Clarity would explain
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-700">
            {insights.map((insight) => (
              <li key={insight} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Add a sample transaction
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Watch the dashboard update instantly
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                Date
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="date"
                  value={formState.date}
                  onChange={(event) => handleChange("date", event.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Amount (₹)
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="number"
                  min="1"
                  value={formState.amount}
                  onChange={(event) => handleChange("amount", event.target.value)}
                  placeholder="2500"
                  required
                />
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-600">
              Merchant
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                type="text"
                value={formState.merchant}
                onChange={(event) => handleChange("merchant", event.target.value)}
                placeholder="Zepto"
                required
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                Category
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="text"
                  value={formState.category}
                  onChange={(event) => handleChange("category", event.target.value)}
                  placeholder="Groceries"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Payment method
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  value={formState.method}
                  onChange={(event) => handleChange("method", event.target.value)}
                >
                  <option>UPI</option>
                  <option>Card</option>
                  <option>NetBanking</option>
                  <option>Wallet</option>
                </select>
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-600">
              City
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                type="text"
                value={formState.city}
                onChange={(event) => handleChange("city", event.target.value)}
                placeholder="Mumbai"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button className="button" type="submit">
                Add sample spend
              </button>
              <button className="button-outline" type="button" onClick={handleReset}>
                Reset demo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Recent activity
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Latest transactions overview
            </h2>
          </div>
          <div className="space-y-3">
            {entries.slice(0, 6).map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{entry.merchant}</p>
                  <p className="text-xs text-slate-500">
                    {format(new Date(entry.date), "dd MMM")}
                    {" · "}
                    {entry.category}
                  </p>
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {formatCurrency(entry.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data template
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Download one-month CSV sample
            </h2>
            <p className="text-sm text-slate-600">
              Use this CSV to explore importing transactions or to share with your team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="button" href="/sample-spending.csv" download>
              Download CSV template
            </a>
            <p className="text-xs text-slate-500">
              Columns: date, merchant, category, amount, method, city
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

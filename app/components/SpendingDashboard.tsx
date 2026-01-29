"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { format } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

type SpendingEntry = {
  id: string;
  date: string;
  time?: string;
  merchant: string;
  category: string;
  amount: number;
  method: string;
  city: string;
  location?: string;
  channel?: string;
  device?: string;
  note?: string;
};

const initialEntries: SpendingEntry[] = [
  {
    id: "txn-1",
    date: "2024-08-01",
    time: "08:42",
    merchant: "Blinkit",
    category: "Groceries",
    amount: 1180,
    method: "UPI",
    city: "Bengaluru",
    location: "Indiranagar",
    channel: "Delivery",
    device: "Pixel 8"
  },
  {
    id: "txn-2",
    date: "2024-08-02",
    time: "19:18",
    merchant: "IndiGo",
    category: "Travel",
    amount: 6450,
    method: "Card",
    city: "Bengaluru",
    location: "T2 Airport",
    channel: "App",
    device: "MacBook Air"
  },
  {
    id: "txn-3",
    date: "2024-08-03",
    time: "21:05",
    merchant: "Swiggy",
    category: "Dining",
    amount: 520,
    method: "UPI",
    city: "Bengaluru",
    location: "Koramangala",
    channel: "Delivery",
    device: "Pixel 8"
  },
  {
    id: "txn-4",
    date: "2024-08-05",
    time: "06:55",
    merchant: "Cult Fit",
    category: "Health",
    amount: 1899,
    method: "Card",
    city: "Bengaluru",
    location: "HSR Layout",
    channel: "Subscription",
    device: "Apple Watch"
  },
  {
    id: "txn-5",
    date: "2024-08-06",
    time: "23:10",
    merchant: "Netflix",
    category: "Subscriptions",
    amount: 649,
    method: "Card",
    city: "Bengaluru",
    location: "Home Wi‑Fi",
    channel: "Recurring",
    device: "Apple TV"
  },
  {
    id: "txn-6",
    date: "2024-08-08",
    time: "13:22",
    merchant: "Zomato",
    category: "Dining",
    amount: 740,
    method: "UPI",
    city: "Bengaluru",
    location: "MG Road",
    channel: "Delivery",
    device: "Pixel 8"
  },
  {
    id: "txn-7",
    date: "2024-08-10",
    time: "09:05",
    merchant: "Uber",
    category: "Transport",
    amount: 410,
    method: "UPI",
    city: "Bengaluru",
    location: "Airport Road",
    channel: "App",
    device: "Pixel 8"
  },
  {
    id: "txn-8",
    date: "2024-08-12",
    time: "20:45",
    merchant: "Amazon",
    category: "Shopping",
    amount: 2599,
    method: "Card",
    city: "Bengaluru",
    location: "Home",
    channel: "Marketplace",
    device: "MacBook Air"
  },
  {
    id: "txn-9",
    date: "2024-08-14",
    time: "10:10",
    merchant: "Tata Power",
    category: "Utilities",
    amount: 1220,
    method: "NetBanking",
    city: "Bengaluru",
    location: "Home",
    channel: "Bill pay",
    device: "MacBook Air"
  },
  {
    id: "txn-10",
    date: "2024-08-16",
    time: "18:20",
    merchant: "IRCTC",
    category: "Travel",
    amount: 2250,
    method: "Card",
    city: "Chennai",
    location: "Egmore",
    channel: "Website",
    device: "MacBook Air"
  },
  {
    id: "txn-11",
    date: "2024-08-18",
    time: "08:05",
    merchant: "BigBasket",
    category: "Groceries",
    amount: 1525,
    method: "UPI",
    city: "Bengaluru",
    location: "Whitefield",
    channel: "Delivery",
    device: "Pixel 8"
  },
  {
    id: "txn-12",
    date: "2024-08-20",
    time: "16:32",
    merchant: "Croma",
    category: "Electronics",
    amount: 8999,
    method: "Card",
    city: "Chennai",
    location: "Phoenix Mall",
    channel: "In-store",
    device: "Pixel 8"
  },
  {
    id: "txn-13",
    date: "2024-08-22",
    time: "11:48",
    merchant: "FreshToHome",
    category: "Groceries",
    amount: 980,
    method: "UPI",
    city: "Bengaluru",
    location: "Bellandur",
    channel: "Delivery",
    device: "Pixel 8"
  },
  {
    id: "txn-14",
    date: "2024-08-24",
    time: "21:30",
    merchant: "BookMyShow",
    category: "Entertainment",
    amount: 1250,
    method: "Card",
    city: "Chennai",
    location: "VR Mall",
    channel: "App",
    device: "Pixel 8"
  },
  {
    id: "txn-15",
    date: "2024-08-26",
    time: "07:25",
    merchant: "Apollo Pharmacy",
    category: "Health",
    amount: 680,
    method: "UPI",
    city: "Bengaluru",
    location: "Indiranagar",
    channel: "In-store",
    device: "Pixel 8"
  },
  {
    id: "txn-16",
    date: "2024-08-28",
    time: "19:55",
    merchant: "Reliance Digital",
    category: "Shopping",
    amount: 4490,
    method: "Card",
    city: "Hyderabad",
    location: "HITEC City",
    channel: "In-store",
    device: "Pixel 8"
  },
  {
    id: "txn-17",
    date: "2024-08-29",
    time: "12:40",
    merchant: "Postpaid",
    category: "Utilities",
    amount: 799,
    method: "NetBanking",
    city: "Bengaluru",
    location: "Home",
    channel: "Bill pay",
    device: "MacBook Air"
  },
  {
    id: "txn-18",
    date: "2024-08-30",
    time: "17:15",
    merchant: "Starbucks",
    category: "Dining",
    amount: 360,
    method: "UPI",
    city: "Bengaluru",
    location: "Lavelle Road",
    channel: "In-store",
    device: "Pixel 8"
  }
];

type NewEntry = {
  date: string;
  time: string;
  merchant: string;
  category: string;
  amount: string;
  method: string;
  city: string;
  location: string;
  channel: string;
  device: string;
  note: string;
};

const defaultFormState: NewEntry = {
  date: "",
  time: "",
  merchant: "",
  category: "",
  amount: "",
  method: "UPI",
  city: "",
  location: "",
  channel: "",
  device: "",
  note: ""
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
    const dayTotals = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.date] = (acc[entry.date] ?? 0) + entry.amount;
      return acc;
    }, {});

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

    const byHour = entries.reduce<Record<string, number>>((acc, entry) => {
      if (!entry.time) {
        return acc;
      }
      const hour = entry.time.split(":")[0];
      acc[hour] = (acc[hour] ?? 0) + entry.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const topMerchant = Object.entries(byMerchant).sort((a, b) => b[1] - a[1])[0];
    const largestPurchase = entries.reduce((largest, entry) =>
      entry.amount > largest.amount ? entry : largest
    );
    const peakDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
    const peakHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0];
    const subscriptionTotal = entries
      .filter((entry) => entry.category === "Subscriptions")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const travelTotal = entries
      .filter((entry) => entry.category === "Travel")
      .reduce((sum, entry) => sum + entry.amount, 0);

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
      weekValues,
      peakDay,
      peakHour,
      subscriptionTotal,
      travelTotal
    };
  }, [entries]);

  const insights = useMemo(() => {
    const total = summary.total || 1;
    const [topCategoryName, topCategoryValue] = summary.topCategory ?? ["--", 0];
    const [topMerchantName, topMerchantValue] = summary.topMerchant ?? ["--", 0];
    const methodEntries = Object.entries(summary.byMethod).sort((a, b) => b[1] - a[1]);
    const topMethod = methodEntries[0];
    const projected = summary.dailyAverage * 30;
    const peakDayLabel = summary.peakDay?.[0]
      ? format(new Date(summary.peakDay[0]), "dd MMM")
      : "--";
    const peakHourLabel = summary.peakHour?.[0]
      ? `${summary.peakHour[0]}:00 - ${Number(summary.peakHour[0]) + 1}:00`
      : "--";

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
      `Peak activity hit on ${peakDayLabel} around ${peakHourLabel}.`,
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
      time: formState.time,
      merchant: formState.merchant,
      category: formState.category,
      amount: amountValue,
      method: formState.method || "UPI",
      city: formState.city || "Remote",
      location: formState.location,
      channel: formState.channel,
      device: formState.device,
      note: formState.note
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
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-8 py-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Clarity demo month · Aug 2024
            </p>
            <h2 className="text-3xl font-semibold">
              Your spending story is alive, predictive, and tailored to your day.
            </h2>
            <p className="max-w-2xl text-sm text-slate-300">
              AI highlights, precise timestamps, and location-aware context help you spot
              patterns instantly. Toggle analytics, ask questions, and zoom from month
              to minute with one glance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="button bg-white text-slate-900 hover:bg-slate-100" type="button">
              Ask Clarity AI
            </button>
            <button className="button-outline border-slate-500 text-white hover:border-white" type="button">
              Explore analytics
            </button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-slate-200">Total outflow</p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.total)}</p>
            <p className="text-xs text-slate-300">18 transactions · 6 categories</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-slate-200">Daily cadence</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatCurrency(summary.dailyAverage)}
            </p>
            <p className="text-xs text-slate-300">
              Peak day {summary.peakDay?.[0] ? format(new Date(summary.peakDay[0]), "dd MMM") : "--"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-slate-200">Recurring load</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatCurrency(summary.subscriptionTotal)}
            </p>
            <p className="text-xs text-slate-300">Subscriptions + bill pay</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
            Peak spend window
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {summary.peakHour?.[0] ? `${summary.peakHour[0]}:00` : "--"}
          </p>
          <p className="text-xs text-slate-500">Most active hour in the day</p>
        </div>
        <div className="card space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Travel outflow
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {formatCurrency(summary.travelTotal)}
          </p>
          <p className="text-xs text-slate-500">Flights, rail, ride-hail</p>
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
            <p className="text-sm text-slate-600">
              Required: date, amount, merchant, and category. Everything else is
              optional, so you can capture just what matters per payment.
            </p>
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
                Exact time (optional)
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="time"
                  value={formState.time}
                  onChange={(event) => handleChange("time", event.target.value)}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
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
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                City (optional)
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="text"
                  value={formState.city}
                  onChange={(event) => handleChange("city", event.target.value)}
                  placeholder="Mumbai"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Location tag (optional)
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="text"
                  value={formState.location}
                  onChange={(event) => handleChange("location", event.target.value)}
                  placeholder="Bandra West · GPS auto"
                />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-600">
                Channel (optional)
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="text"
                  value={formState.channel}
                  onChange={(event) => handleChange("channel", event.target.value)}
                  placeholder="Delivery, In-store, App"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-600">
                Device (optional)
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  type="text"
                  value={formState.device}
                  onChange={(event) => handleChange("device", event.target.value)}
                  placeholder="Pixel 8, MacBook Air"
                />
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-600">
              Notes (optional)
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900"
                type="text"
                value={formState.note}
                onChange={(event) => handleChange("note", event.target.value)}
                placeholder="Travel reimburseable, shared expense"
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
                    {entry.time ? ` · ${entry.time}` : ""}
                    {" · "}
                    {entry.category}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </p>
                  {entry.channel || entry.device ? (
                    <p className="text-xs text-slate-400">
                      {entry.channel ? `Channel: ${entry.channel}` : ""}
                      {entry.channel && entry.device ? " · " : ""}
                      {entry.device ? `Device: ${entry.device}` : ""}
                    </p>
                  ) : null}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {formatCurrency(entry.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
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
                Columns: date, time, merchant, category, amount, method, city, location, channel, device
              </p>
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Data signals
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Expand context for deeper insights
              </h2>
              <p className="text-sm text-slate-600">
                Clarity can enrich spend data with optional context when permissions are available.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Exact timestamp", desc: "Minute-level view of spend windows." },
                { title: "Location footprint", desc: "GPS or neighborhood tags for context." },
                { title: "Channel intelligence", desc: "Delivery vs in-store vs subscription." },
                { title: "Device + app source", desc: "Which app or card initiated it." },
                { title: "Smart tags", desc: "Team lunch, business, personal, reimbursable." },
                { title: "AI intent notes", desc: "Auto-summarized purpose of spend." }
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              AI insight cockpit
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Quick-glance summary + next best actions
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                title: "Monthly summary",
                copy: "You spent most on Travel and Shopping, with a late-evening surge on weekends."
              },
              {
                title: "Savings opportunity",
                copy: "Trim subscriptions by ₹480 by pausing low-usage entertainment apps."
              },
              {
                title: "Cash-flow risk",
                copy: "Week 3 spike exceeded your usual weekly average by 38%."
              },
              {
                title: "Habit insight",
                copy: "Dining orders are 2.4× higher when spending after 8pm."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Show subscriptions detail",
              "Why did travel spike?",
              "Compare weekdays vs weekends",
              "Suggest a savings target"
            ].map((chip) => (
              <button
                key={chip}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="card space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Clarity AI chat
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Ask questions, get instant narratives
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                role: "assistant",
                message: "You spent ₹6.4k on travel this month. Most of it came from flights."
              },
              {
                role: "user",
                message: "What should I watch next month?"
              },
              {
                role: "assistant",
                message: "Dining after 8pm is trending up. Setting a ₹3k cap could save ~₹1.1k."
              }
            ].map((chat, index) => (
              <div
                key={`${chat.role}-${index}`}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  chat.role === "assistant"
                    ? "bg-slate-50 text-slate-700"
                    : "bg-slate-900 text-white"
                }`}
              >
                {chat.message}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <input
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
              placeholder="Ask Clarity about my spend..."
              type="text"
            />
            <button className="button" type="button">
              Send
            </button>
          </div>
          <p className="text-xs text-slate-500">
            AI summaries update in real time as new transactions arrive.
          </p>
        </div>
      </div>
    </section>
  );
}

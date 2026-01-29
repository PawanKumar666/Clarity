"use client";

import { useState } from "react";

type InsightCardProps = {
  id?: string;
  title: string;
  text: string;
  type: "daily" | "weekly" | "subscription";
};

export default function InsightCard({ id, title, text, type }: InsightCardProps) {
  const [submitted, setSubmitted] = useState(false);

  const sendFeedback = async (rating: "accurate" | "inaccurate") => {
    if (!id) return;
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insightId: id, rating, type })
    });
    setSubmitted(true);
  };

  return (
    <div className="card flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="mt-2 text-lg font-medium text-slate-900">{text}</p>
      </div>
      {submitted ? (
        <p className="text-sm text-emerald-600">Thanks — this helps improve clarity.</p>
      ) : id ? (
        <div className="flex flex-wrap gap-2">
          <button className="button-muted" onClick={() => sendFeedback("accurate")}>
            Accurate
          </button>
          <button
            className="button-outline"
            onClick={() => sendFeedback("inaccurate")}
          >
            Not accurate
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Add more data to unlock feedback.</p>
      )}
    </div>
  );
}

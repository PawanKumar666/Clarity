"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { format } from "date-fns";

type TransactionItem = {
  id: string;
  date: string;
  amount: number;
  method: string;
  merchantClean: string;
  merchantRaw: string;
};

type Props = {
  transactions: TransactionItem[];
};

const METHODS = ["ALL", "UPI", "CARD", "WALLET", "UNKNOWN"];

export default function TransactionFeed({ transactions }: Props) {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("ALL");

  const filtered = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch = txn.merchantClean
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesMethod = method === "ALL" || txn.method === method;
      return matchesSearch && matchesMethod;
    });
  }, [transactions, search, method]);

  return (
    <div className="card">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Transaction feed</h3>
          <p className="text-sm text-slate-500">
            Reverse chronological with raw descriptions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            className="input md:w-56"
            placeholder="Search merchant"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="input md:w-40"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            {METHODS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions found.</p>
        ) : (
          filtered.map((txn) => (
            <div
              key={txn.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {txn.merchantClean}
                </p>
                <p className="text-xs text-slate-500">
                  from: {txn.merchantRaw}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={clsx(
                    "badge",
                    txn.amount < 0 && "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {txn.amount < 0 ? "Refund" : txn.method}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  ₹{Math.abs(txn.amount).toFixed(0)}
                </span>
                <span className="text-xs text-slate-500">
                  {format(new Date(txn.date), "dd MMM yyyy")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function DevTools() {
  const [status, setStatus] = useState<string | null>(null);

  const handleReset = async () => {
    setStatus("Resetting...");
    await fetch("/api/reset?dev=1", { method: "POST" });
    setStatus("Demo data cleared.");
  };

  return (
    <div className="card space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Dev tools</h2>
      <p className="text-sm text-slate-500">
        Reset the demo user to start fresh.
      </p>
      <button className="button" onClick={handleReset}>
        Reset demo data
      </button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  );
}

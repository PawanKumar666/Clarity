"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingClient() {
  const router = useRouter();
  const [smsText, setSmsText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleSmsIngest = async () => {
    setStatus("Processing...");
    setWarning(null);
    const response = await fetch("/api/ingest/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: smsText })
    });
    const result = await response.json();
    if (result.failed > 0) {
      setWarning("Some messages couldn’t be read.");
    }
    setStatus(null);
    router.push("/home");
  };

  const handleCsvFile = async (file: File) => {
    setStatus("Processing...");
    setWarning(null);
    const text = await file.text();
    const response = await fetch("/api/ingest/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const result = await response.json();
    if (result.failed > 0) {
      setWarning("Some rows couldn’t be read.");
    }
    setStatus(null);
    router.push("/home");
  };

  const handleSample = async () => {
    setStatus("Loading sample data...");
    setWarning(null);
    const response = await fetch("/sample.csv");
    const text = await response.text();
    await fetch("/api/ingest/csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    setStatus(null);
    router.push("/home");
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Paste SMS alerts</h2>
        <p className="mt-1 text-sm text-slate-500">
          Paste multiple lines — each line should be one SMS alert.
        </p>
        <textarea
          className="input mt-4 h-40"
          placeholder="e.g. Rs.550 spent on Swiggy via UPI on 2024-01-18"
          value={smsText}
          onChange={(event) => setSmsText(event.target.value)}
        />
        <button
          className="button mt-4"
          onClick={handleSmsIngest}
          disabled={!smsText.trim()}
        >
          Process SMS
        </button>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Upload CSV</h2>
        <p className="mt-1 text-sm text-slate-500">
          Use columns: date, amount, description, method (optional).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="button-outline cursor-pointer">
            Choose CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleCsvFile(file);
              }}
            />
          </label>
          <a className="button-muted" href="/sample.csv" download>
            Download template
          </a>
          <button className="button" onClick={handleSample}>
            Load sample India data
          </button>
        </div>
      </div>
      {status && <p className="text-sm text-slate-600">{status}</p>}
      {warning && <p className="text-sm text-amber-600">{warning}</p>}
    </div>
  );
}

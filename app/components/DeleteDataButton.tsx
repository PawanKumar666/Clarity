"use client";

import { useState } from "react";

export default function DeleteDataButton() {
  const [status, setStatus] = useState<string | null>(null);

  const handleDelete = async () => {
    setStatus("Deleting...");
    await fetch("/api/delete", { method: "POST" });
    setStatus("All demo data deleted.");
  };

  return (
    <div className="space-y-3">
      <button className="button" onClick={handleDelete}>
        Delete my data
      </button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </div>
  );
}

import Link from "next/link";
import DeleteDataButton from "@/app/components/DeleteDataButton";

export default function PrivacyPage() {
  return (
    <main className="container pb-16 pt-12">
      <div className="mb-8">
        <Link className="text-sm font-semibold text-slate-500" href="/">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Privacy</h1>
      </div>
      <div className="space-y-6">
        <div className="card space-y-3">
          <p className="text-sm text-slate-600">
            Clarity is read-only. In this demo, uploads are stored in a local
            SQLite database on your machine. Nothing leaves your environment.
          </p>
          <p className="text-sm text-slate-600">
            You can wipe the demo user’s transactions, insights, and feedback at
            any time.
          </p>
          <DeleteDataButton />
        </div>
      </div>
    </main>
  );
}

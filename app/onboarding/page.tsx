import Link from "next/link";
import OnboardingClient from "@/app/components/OnboardingClient";

export default function OnboardingPage() {
  return (
    <main className="container pb-16 pt-12">
      <div className="mb-8">
        <Link className="text-sm font-semibold text-slate-500" href="/">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Bring in your transactions
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Clarity works read-only. Paste SMS alerts or upload a CSV. We normalize
          merchants, spot patterns, and generate a clear narrative. No budgets or
          dashboards.
        </p>
      </div>
      <OnboardingClient />
    </main>
  );
}

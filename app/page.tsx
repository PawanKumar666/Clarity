import Link from "next/link";
import SpendingDashboard from "@/app/components/SpendingDashboard";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="container pb-10 pt-12">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Clarity • India-first spending intelligence
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
              The personal finance cockpit that speaks your language.
            </h1>
            <p className="max-w-3xl text-lg text-slate-600">
              Charts, metrics, mapping, and AI-generated insights live right on the home
              dashboard. Load a sample month, add a new transaction, and watch the
              narrative update instantly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button" href="/home">
              View full dashboard
            </Link>
            <Link className="button-outline" href="/onboarding">
              Upload real data
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <SpendingDashboard />
      </section>

      <section className="container pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "LLM-powered narratives",
              copy: "Turn transaction feeds into clear stories, habits, and nudges."
            },
            {
              title: "Payment source integrations",
              copy: "UPI, cards, and wallets will sync securely for real-time insights."
            },
            {
              title: "Actionable next steps",
              copy: "Receive personalized savings experiments and cash-flow guardrails."
            }
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

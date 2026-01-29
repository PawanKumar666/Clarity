import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="container pb-20 pt-16">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Clarity • India-first spending insight
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            Understand your spending in plain language, not dashboards.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Clarity turns your SMS and CSV transactions into gentle, human-readable
            insights. No budgets. No categories to manage. Just a calm narrative of
            what changed and why.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="button" href="/onboarding">
              Try demo
            </Link>
            <Link className="button-outline" href="/privacy">
              Privacy promise
            </Link>
          </div>
        </div>
      </section>
      <section className="container pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Instant clarity",
              copy: "See where your money went today and what quietly shifted this week."
            },
            {
              title: "Local signals",
              copy: "Built for Indian payment patterns like UPI, cards, and wallets."
            },
            {
              title: "Trust-first",
              copy: "Your data stays local for this demo, with one-click deletion."
            }
          ].map((item) => (
            <div key={item.title} className="card">
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container pb-20">
        <div className="card flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Ready for a calmer money story?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Upload a CSV or paste SMS alerts to see the narrative.
            </p>
          </div>
          <Link className="button" href="/onboarding">
            Start demo
          </Link>
        </div>
      </section>
    </main>
  );
}

# Clarity

India-first spending clarity without budgets or dashboards.

## How to run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

App runs at `http://localhost:3000`.

## Routes available

- `/` – Landing page
- `/onboarding` – Upload/paste ingest flows
- `/home` – Insights + transaction feed
- `/privacy` – Privacy explanation + delete data
- `/dev?dev=1` – Dev tools (reset demo data)

## Extend later (bank aggregation)

- Replace SMS/CSV ingestion with a bank/UPI aggregation service and normalize incoming payloads in `app/lib/parse.ts`.
- Move merchant normalization + categorization into a shared service or ML pipeline.
- Replace the demo user pattern with real auth and per-user encryption keys.
- Store raw provider metadata in `metadata` fields to support richer insights.

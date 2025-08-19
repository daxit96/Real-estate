RealtyFlow - Production helper files
----------------------------------

Included in this package:
- Dockerfile
- docker-compose.yml (app, worker, db, redis, pgadmin)
- deploy/nginx/crm.conf (nginx reverse proxy sample)
- deploy/scripts/pg_backup.sh (postgres dump + rotation)
- .github/workflows/ci-cd.yml (CI build + basic deploy via rsync/ssh)
- server/routes/payments.ts (Stripe + Razorpay webhook stubs)
- server/lib/comm.ts (SendGrid & Twilio adapters with console fallback)
- server/routes/pdf.ts (puppeteer-based shortlist PDF endpoint)
- sql/rls_example.sql (Row Level Security snippet for deals)
- .env.production.example (env template)

Quick start (local, Docker):
1. Copy .env.production.example -> .env.production and fill values.
2. Build & start: docker compose up -d --build
3. Initialize DB schema: run schema.sql against the postgres container.
4. Run seed script to populate demo data (node seed.js) or via container.
5. Visit http://localhost:3000 for the app, http://localhost:8080 for pgAdmin.

Notes:
- Puppeteer needs extra memory; for local dev it usually works. In small VPS you may need to increase container memory or use a hosted PDF service.
- Stripe webhook endpoint expects raw body. Ensure reverse proxy forwards raw body or configure stripe CLI to test locally.
- Replace console fallback email/whatsapp with real keys in production .env.production.

# OTR Portfolios

Live basketball portfolio platform — built for OTR Tours.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in all values in .env.local
```

## First-time DB setup

```bash
# Push schema to Neon
npm run db:push
```

## Development

```bash
npm run dev
```

## Environment variables

See [.env.local.example](.env.local.example) for all required vars.

Key things to set up:
1. **Neon** — create a free project at neon.tech, paste the connection string as `DATABASE_URL`
2. **Stripe** — create 4 products (College $397, Pro $497, Sponsorship $497, Full Stack $997), get price IDs. Create coupon code `OTR` = 10% off.
3. **Resend** — create an account, verify your domain, get API key
4. **Anthropic** — get API key from console.anthropic.com
5. **AUTH_SECRET** — run `openssl rand -base64 32`

## Deployment

Push to GitHub → connect to Vercel → add all env vars → deploy.

Set up Stripe webhook pointing to `https://yourdomain.com/api/webhooks/stripe` with event `checkout.session.completed` and `charge.refunded`.

Add `CRON_SECRET` env var (any random string) — Vercel Cron will use it.

## Architecture

- `/` — Sales page
- `/sample` → `/p/maison-scheibel` — Live demo portfolio
- `/checkout/[tier]` — Stripe Checkout redirect
- `/intake/[orderId]?t=token` — Token-gated intake form
- `/p/[slug]` — Published portfolio
- `/p/[slug]/print` — Print/PDF version
- `/admin` — Orders dashboard (magic-link auth)
- `/admin/orders/[id]` — Generate AI drafts, edit, publish

## Build phases completed

- [x] Phase 1 — Scaffold (Next.js, Tailwind, Drizzle, NextAuth, Vercel config)
- [x] Phase 2 — Sales page + Stripe Checkout
- [x] Phase 3 — Intake form + webhooks + Resend
- [x] Phase 4 — Portfolio template (/p/[slug]) + Maison sample data
- [x] Phase 5 — Admin dashboard + AI draft generation + publish flow
- [x] Phase 6 — PDF (Puppeteer), OG images (@vercel/og), delivery email
- [x] Phase 7 — Day-3 reminder cron (Vercel Cron), legal pages

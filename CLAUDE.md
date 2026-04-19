# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # prisma generate + next build
npm run lint         # Run ESLint
npx prisma migrate dev       # Apply schema changes and generate client
npx prisma studio            # Browse database in GUI
npx prisma generate          # Regenerate client after schema edits (no migration)
```

For local Stripe webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```
Copy the printed signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Environment Variables

Minimum required in `.env.local`:
- `DATABASE_URL` — PostgreSQL connection string
- `ANTHROPIC_API_KEY`
- `SESSION_SECRET` — generate with `openssl rand -base64 32`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID`
- `CRON_SECRET` — bearer token for `/api/cron/reset-monthly-chats`
- `RESEND_API_KEY` — for transactional email (verification, password reset)

## Architecture

Next.js 16 App Router. Server components load data; client components handle interactive UI; API routes serve the chat stream, Stripe integration, and cron jobs. PostgreSQL via Prisma 7 stores all state.

### Authentication

Custom JWT implementation (`lib/session.ts`) — no third-party auth provider. Sessions are HS256 JWTs stored in an HTTP-only `session` cookie (7-day expiry, no refresh tokens). `app/actions/auth.ts` handles login/signup as server actions.

Email verification and password reset tokens are stored on the `User` row with expiry timestamps.

### Chat

`POST /api/chat` — verifies session, enforces free-tier limit (5 chats/month via `monthlyChatsUsed` on the User row), streams Claude responses as SSE, then saves the full conversation to the `Conversation` table (messages stored as a single JSON string column).

The system prompt tunes Claude as a pet-loss grief counselor.

### Stripe

Three routes under `app/api/stripe/`:
- `create-checkout-session` — creates a Stripe Checkout session (subscription mode, $9.99/mo)
- `create-portal-session` — returns Stripe-hosted billing portal URL
- `webhooks` — signature-verified handler that updates `User.planTier`, `User.subscriptionStatus`, and upserts `Subscription` records

### Database (Prisma 7 + PostgreSQL)

Key schema notes:
- `Conversation.messages` is a stringified JSON array (not normalized rows) — one conversation per user
- `User` carries all subscription state (`planTier`, `subscriptionStatus`, `currentPeriodStart/End`, `cancelAtPeriodEnd`) plus `crisisSignal` tracking and email verification fields
- Prisma 7 uses `prisma.config.ts` (not `schema.prisma`) for the datasource URL — `datasourceUrl` in `PrismaClient` constructor if overriding at runtime

Monthly chat counter reset: `GET /api/cron/reset-monthly-chats` (bearer token auth via `CRON_SECRET`), called by an external scheduler.

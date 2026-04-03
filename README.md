# Shared Leash

A compassionate AI companion for people grieving the loss of a beloved pet. Shared Leash provides a gentle, always-available space to talk through feelings of loss, powered by Claude.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Database | SQLite via Prisma 7 (better-sqlite3) |
| Auth | Custom JWT sessions (jose + bcryptjs) |
| AI | Claude Opus (Anthropic SDK) |
| Payments | Stripe (subscriptions, checkout, webhooks) |

## Prerequisites

- Node.js 20+
- npm (or yarn/pnpm/bun)
- A Stripe account (test mode is fine for development)
- An Anthropic API key

## Getting Started

1. **Clone and install**

   ```bash
   git clone <repo-url> && cd shared-leash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the values — see `.env.example` for guidance on each variable. At minimum you need:

   - `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com/settings/keys)
   - `SESSION_SECRET` — generate with `openssl rand -base64 32`
   - Stripe keys — from [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
   - `STRIPE_PREMIUM_PRICE_ID` — create a "$9.99/mo" recurring product in Stripe and copy the price ID

3. **Set up the database**

   ```bash
   npx prisma migrate dev
   ```

   This creates the SQLite database at `.data/shared-leash.db`.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Stripe Webhooks (Local Dev)

To test subscription events locally, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Copy the webhook signing secret it prints into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Browse database in a GUI |
| `npx prisma migrate dev` | Apply pending migrations |

## Project Structure

```
app/
  api/
    chat/               # Claude chat endpoint (streaming)
    stripe/             # Checkout, portal, and webhook routes
    cron/               # Monthly chat-count reset
  actions/
    auth.ts             # Login / signup server actions
  components/
    ChatInterface.tsx   # Main chat UI (client component)
    LandingPage.tsx     # Marketing page for logged-out users
    AccountPage.tsx     # Subscription & account management
  login/                # Login page
  register/             # Registration page
  account/              # Account management page
  page.tsx              # Home — chat (authenticated) or landing (guest)
  layout.tsx            # Root layout (fonts, metadata)
lib/
  db.ts                 # Database query helpers (users, conversations)
  prisma.ts             # Prisma client singleton
  session.ts            # JWT session create / verify / destroy
  stripe.ts             # Stripe client singleton
prisma/
  schema.prisma         # Database schema
  migrations/           # Migration history
```

## Environment Variables

See `.env.example` for the full list and inline documentation.

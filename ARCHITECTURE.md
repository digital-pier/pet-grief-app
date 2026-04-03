# Architecture

## Overview

Shared Leash is a Next.js 16 App Router application. Server components handle data loading, client components handle interactive UI, and API routes serve the chat stream, Stripe integration, and cron jobs. SQLite (via Prisma) stores all persistent state.

```
Browser
  |
  |-- Server Components (page.tsx, layout.tsx)
  |     └── Prisma ──> SQLite (.data/shared-leash.db)
  |
  |-- Client Components (ChatInterface, AccountPage)
  |     └── fetch() to API routes
  |
  |-- API Routes
        ├── /api/chat ──> Anthropic Claude API (streaming)
        ├── /api/stripe/* ──> Stripe API
        └── /api/cron/* ──> scheduled maintenance
```

---

## Authentication Flow

Auth is a custom JWT implementation — no third-party auth provider.

```
Register / Login
  └── app/actions/auth.ts (server action)
        ├── Validate input (name >=2, email format, password >=8)
        ├── Signup: hash password (bcryptjs, 10 rounds) → create user in DB
        │   Login: find user by email → bcrypt.compare
        └── createSession(userId) → lib/session.ts
              ├── Sign JWT (HS256) with { userId, exp: 7 days }
              └── Set HTTP-only cookie "session" (sameSite=lax, secure in prod)

Every protected page / API route:
  └── getSession() → lib/session.ts
        ├── Read "session" cookie
        ├── Verify JWT signature + expiration
        └── Return { userId } or null (→ redirect to /login)
```

**Key decisions:**
- No refresh tokens — sessions simply expire after 7 days.
- Passwords are never stored in plaintext; only the bcrypt hash is persisted.
- The `SESSION_SECRET` env var is the single signing key.

---

## Chat Flow

```
User types message
  └── ChatInterface.tsx (client)
        ├── Append user message to local state
        ├── POST /api/chat  { messages: [...history, newMessage] }
        │     └── API route (app/api/chat/route.ts)
        │           ├── Verify session (JWT cookie)
        │           ├── Look up user (plan tier, monthly usage)
        │           ├── Free tier? Check monthlyChatsUsed < 5
        │           │     └── Increment counter in DB
        │           ├── Call Anthropic SDK: client.messages.create({
        │           │       model: "claude-opus-4-6",
        │           │       max_tokens: 1024,
        │           │       system: <grief-companion prompt>,
        │           │       messages: conversationHistory,
        │           │       stream: true
        │           │   })
        │           ├── Stream response chunks as SSE (text/event-stream)
        │           └── On stream end: save full conversation to DB
        └── Client accumulates streamed text, renders in real time
```

**System prompt** instructs Claude to act as a compassionate grief counselor specializing in pet loss — validates grief, avoids clichés, addresses guilt around euthanasia decisions, and offers to refer to mental health professionals when appropriate.

**Rate limiting:** Free-tier users get 5 chats per calendar month. The counter (`monthlyChatsUsed`) is stored on the User row and reset by a cron job.

---

## Stripe Subscription Flow

### Checkout (free → premium)

```
User clicks "Upgrade" in ChatInterface or AccountPage
  └── POST /api/stripe/create-checkout-session
        ├── Verify session
        ├── Find or create Stripe Customer (store stripeCustomerId on User)
        ├── stripe.checkout.sessions.create({
        │     mode: "subscription",
        │     price: STRIPE_PREMIUM_PRICE_ID,  // $9.99/mo
        │     success_url: /account?upgraded=true,
        │     cancel_url: /account
        │   })
        └── Return checkout URL → client redirects
```

### Webhook Processing

```
Stripe sends POST /api/stripe/webhooks
  ├── Verify signature (STRIPE_WEBHOOK_SECRET)
  └── Handle event:
        ├── customer.subscription.created
        │   customer.subscription.updated
        │     └── Update User: planTier, subscriptionStatus,
        │         currentPeriodStart/End, cancelAtPeriodEnd
        │         + upsert Subscription record
        │
        ├── customer.subscription.deleted
        │     └── Revert User to free tier (planTier="free",
        │         subscriptionStatus="canceled")
        │
        ├── invoice.payment_succeeded
        │     └── Activate premium, reset monthlyChatsUsed to 0
        │
        └── invoice.payment_failed
              └── Set subscriptionStatus="past_due"
```

### Billing Portal

```
User clicks "Manage Billing" on AccountPage
  └── POST /api/stripe/create-portal-session
        └── Returns Stripe-hosted portal URL (update payment method, cancel, etc.)
```

---

## Database Schema

Three models in SQLite via Prisma:

```
┌──────────────────────────┐
│          User            │
├──────────────────────────┤
│ id              Int PK   │
│ name            String   │
│ email           String U │  U = unique
│ passwordHash    String   │
│ createdAt       DateTime │
│                          │
│ stripeCustomerId String? │
│ subscriptionStatus Str?  │
│ planTier         String  │  "free" | "premium"
│ currentPeriodStart DT?   │
│ currentPeriodEnd   DT?   │
│ cancelAtPeriodEnd  Bool  │
│                          │
│ monthlyChatsUsed  Int    │  reset monthly by cron
│ monthlyChatsResetAt DT?  │
├──────────────────────────┤
│ 1:1  → Conversation      │
│ 1:N  → Subscription      │
└──────────────────────────┘

┌──────────────────────────┐
│      Conversation        │
├──────────────────────────┤
│ userId    Int PK FK→User │
│ messages  String (JSON)  │  stringified message array
│ updatedAt DateTime       │
└──────────────────────────┘

┌──────────────────────────┐
│      Subscription        │
├──────────────────────────┤
│ id                Int PK │
│ userId            Int FK │
│ stripeSubscriptionId Str U│
│ status            String │
│ planTier          String │
│ currentPeriodStart DT?   │
│ currentPeriodEnd   DT?   │
│ cancelAtPeriodEnd  Bool  │
│ createdAt         DT     │
│ updatedAt         DT     │
└──────────────────────────┘
```

**Note:** Conversation messages are stored as a single JSON string column rather than normalized rows. This keeps the schema simple for a 1:1 user-to-conversation model.

---

## Cron: Monthly Chat Reset

`GET /api/cron/reset-monthly-chats` (protected by `CRON_SECRET` bearer token)

Resets `monthlyChatsUsed` to 0 for all free-tier users. Intended to be called once per month by an external scheduler (e.g., EasyCron, Vercel Cron, GitHub Actions).

---

## Security Summary

| Concern | Approach |
|---------|----------|
| Password storage | bcryptjs (10 salt rounds) |
| Session tokens | HS256 JWT in HTTP-only, sameSite=lax cookie |
| Stripe webhooks | Signature verification via webhook secret |
| Cron endpoint | Bearer token authorization |
| CSRF | sameSite=lax cookies + server actions |
| XSS | HTTP-only cookies (JS cannot read session) |

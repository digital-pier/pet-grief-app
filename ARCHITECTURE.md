# Architecture

## Overview

Shared Leash is a Next.js 16 App Router application. Server components handle data loading, client components handle interactive UI, and API routes serve the chat stream and auth flows. PostgreSQL (via Prisma 7 + Supabase) stores all persistent state.

```
Browser
  |
  |-- Server Components (page.tsx, layout.tsx)
  |     └── Prisma ──> PostgreSQL (Supabase)
  |
  |-- Client Components (ChatInterface, AccountPage)
  |     └── fetch() to API routes
  |
  |-- API Routes
        ├── /api/chat ──> Anthropic Claude API (streaming, cached)
        ├── /api/auth/* ──> email verification, session refresh
        ├── /api/logout ──> session teardown
        └── /api/admin/* ──> admin user management
```

---

## Authentication Flow

Auth is a custom JWT implementation — no third-party auth provider.

```
Register
  └── app/actions/auth.ts (server action)
        ├── IP rate limit: 3 signup attempts/hour
        ├── Validate input (name >=2, email format, password >=8)
        ├── Hash password (bcryptjs, 10 rounds) → create User in DB
        ├── Generate emailVerificationToken (24-hour expiry) → store on User
        └── Send verification email via Resend → /auth/verify?token=

Email Verification
  └── GET /auth/verify?token=
        ├── Find user by emailVerificationToken, check expiry
        ├── Set emailVerified=true, clear token fields
        └── createSession(userId) → lib/session.ts

  POST /api/auth/resend-verification
        └── Rate limit: 1 resend/minute per user

Login
  └── app/actions/auth.ts (server action)
        ├── IP rate limit: 10 login attempts/15 min
        ├── Find user by email → check lockedUntil (15-min lockout after 5 failures)
        ├── bcrypt.compare → on failure: increment failedLoginAttempts
        ├── On success: reset failedLoginAttempts → createSession(userId)
        └── Requires emailVerified=true to access chat

Every protected page / API route:
  └── getSession() → lib/session.ts
        ├── Read "session" cookie
        ├── Verify JWT signature + expiration (jose library)
        └── Return { userId } or null (→ redirect to /login)
```

**Key decisions:**
- Sessions are HS256 JWTs in an HTTP-only cookie (7-day expiry, no refresh tokens).
- Passwords are never stored in plaintext; only the bcrypt hash is persisted.
- The `SESSION_SECRET` env var is the single signing key.
- Users must verify email before accessing chat.
- Account lockout (5 failures → 15-min lock) prevents brute force.

---

## Email

Provider: **Resend** (`resend` package). All emails sent from `FROM_EMAIL` env var (e.g. `noreply@peternal.app`).

| Email | Trigger |
|-------|---------|
| Verification | New signup |
| Welcome | Email verified |
| Password reset | Forgot-password request |
| Admin registration notification | New signup (notifies admin address) |

Password reset tokens have a 1-hour expiry. The forgot-password endpoint returns a generic success message regardless of whether the email exists.

---

## Chat Flow

```
User types message
  └── ChatInterface.tsx (client)
        ├── Append user message to local state
        ├── POST /api/chat  { messages: [...history, newMessage] }
        │     └── app/api/chat/route.ts
        │           ├── Verify session (JWT cookie)
        │           ├── Require emailVerified=true
        │           ├── Look up user (plan tier, monthly usage)
        │           ├── Free tier? Check monthlyChatsUsed < 5
        │           │     └── Increment counter in DB
        │           ├── Crisis detection: regex on message content
        │           │     └── Match → set crisisSignal=true, crisisSignalAt on User
        │           ├── RAG: getRelevantChunks() → inject knowledge into system prompt
        │           ├── Call Anthropic SDK: client.messages.create({
        │           │       model: "claude-sonnet-4-6",
        │           │       max_tokens: 1024,
        │           │       system: [grief-companion blocks w/ cache_control],
        │           │       messages: conversationHistory (w/ cache breakpoint),
        │           │       stream: true
        │           │   })
        │           ├── Stream response chunks as SSE (text/event-stream)
        │           └── On stream end:
        │                 ├── Save full conversation to Conversation table
        │                 └── Log token counts (incl. cache metrics) to ChatLog table
        └── Client accumulates streamed text, renders in real time
```

**System prompt** instructs Claude to act as a compassionate grief counselor specializing in pet loss — validates grief, avoids clichés, addresses guilt around euthanasia decisions, includes crisis protocol, and offers to refer to mental health professionals when appropriate.

**Prompt caching:** System prompt blocks and conversation context carry `cache_control: { type: "ephemeral" }` breakpoints to reduce latency and cost on repeated turns.

**RAG:** `lib/rag.ts` supplies relevant knowledge chunks injected into the system prompt per request.

**Rate limiting:** Free-tier users get 5 chats per calendar month (`monthlyChatsUsed` on User row). Schema fields exist for a monthly reset cron (`monthlyChatsResetAt`) but the cron endpoint is not yet implemented.

---

## Stripe Subscription (Planned)

Stripe is configured (env vars, schema fields on User and Subscription models) but API routes are **not yet implemented**. The schema supports:
- `User.stripeCustomerId`, `planTier`, `subscriptionStatus`, `currentPeriodStart/End`, `cancelAtPeriodEnd`
- `Subscription` records per billing cycle

When implemented, the flow will mirror the original design: Checkout session → webhook handler → billing portal.

---

## Admin Panel

`/admin` — protected by `User.isAdmin=true` check.

- Lists all users with subscription status, monthly chat count, and crisis signal flags.
- `DELETE /api/admin/users/[id]` — hard-deletes a user and all related records.

---

## Database Schema

Four models in PostgreSQL via Prisma 7 + Supabase (Transaction Pooler, port 6543):

```
┌──────────────────────────────────┐
│              User                │
├──────────────────────────────────┤
│ id                    Int PK     │
│ name                  String     │
│ email                 String U   │  U = unique
│ passwordHash          String     │
│ createdAt             DateTime   │
│ isAdmin               Bool       │
│                                  │
│ -- Auth security --              │
│ failedLoginAttempts   Int        │
│ lockedUntil           DateTime?  │
│                                  │
│ -- Email verification --         │
│ emailVerified         Bool       │
│ emailVerificationToken String? U │
│ emailVerificationExpiry DT?      │
│                                  │
│ -- Password reset --             │
│ passwordResetToken    String? U  │
│ passwordResetExpiry   DateTime?  │
│                                  │
│ -- Subscription (Stripe) --      │
│ stripeCustomerId      String?    │
│ subscriptionStatus    String?    │  default: "free"
│ planTier              String     │  "free" | "premium"
│ currentPeriodStart    DateTime?  │
│ currentPeriodEnd      DateTime?  │
│ cancelAtPeriodEnd     Bool       │
│                                  │
│ -- Usage --                      │
│ monthlyChatsUsed      Int        │
│ monthlyChatsResetAt   DateTime?  │
│                                  │
│ -- Crisis detection --           │
│ crisisSignal          Bool       │
│ crisisSignalAt        DateTime?  │
├──────────────────────────────────┤
│ 1:1  → Conversation              │
│ 1:N  → Subscription              │
│ 1:N  → ChatLog                   │
└──────────────────────────────────┘

┌──────────────────────────┐
│      Conversation        │
├──────────────────────────┤
│ userId    Int PK FK→User │
│ messages  String (JSON)  │  stringified message array, default "[]"
│ updatedAt DateTime       │
└──────────────────────────┘

┌──────────────────────────────┐
│          ChatLog             │
├──────────────────────────────┤
│ id                 Int PK   │
│ requestId          String   │
│ userId             Int FK   │
│ model              String   │
│ inputTokens        Int      │
│ outputTokens       Int      │
│ cacheCreationTokens Int     │
│ cacheReadTokens    Int      │
│ serviceTier        String   │  default: "standard"
│ createdAt          DateTime │
└──────────────────────────────┘

┌──────────────────────────────┐
│        Subscription          │
├──────────────────────────────┤
│ id                   Int PK │
│ userId               Int FK │
│ stripeSubscriptionId Str U  │
│ status               String │
│ planTier             String │
│ currentPeriodStart   DT?    │
│ currentPeriodEnd     DT?    │
│ cancelAtPeriodEnd    Bool   │
│ createdAt            DT     │
│ updatedAt            DT     │
└──────────────────────────────┘
```

**Notes:**
- Conversation messages are stored as a single JSON string column — one conversation per user.
- ChatLog records every API call with full token/cache metrics for cost tracking.
- Prisma 7 config lives in `prisma.config.ts` (not `schema.prisma`). PrismaClient is instantiated with `@prisma/adapter-pg` pointing at Supabase's Transaction Pooler.

---

## Security Summary

| Concern | Approach |
|---------|----------|
| Password storage | bcryptjs (10 salt rounds) |
| Session tokens | HS256 JWT in HTTP-only, sameSite=lax cookie (jose) |
| Brute force | Account lockout after 5 failures (15-min), IP rate limits on auth endpoints |
| Email enumeration | Generic success responses on password reset |
| Email verification | Required before chat access; 24-hour token expiry |
| Crisis signals | Server-side regex detection; flagged on user record; visible to admin |
| Stripe webhooks | Signature verification via webhook secret (when implemented) |
| CSRF | sameSite=lax cookies + server actions |
| XSS | HTTP-only cookies (JS cannot read session) |

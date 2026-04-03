# Features

## What Shared Leash Does

Shared Leash is an AI companion for people grieving the loss of a pet. It provides a private, judgment-free space to talk about loss, powered by Claude — available any time of day.

---

## Feature Status

### Implemented

#### AI Grief Companion Chat
A conversational interface where users talk with an AI that is specifically tuned for pet-loss grief support. The AI validates grief as real and profound, avoids clichés like "they're in a better place," recognizes guilt around difficult decisions (e.g., euthanasia), and gently offers questions to help users process their feelings.

- Real-time streaming responses (text appears as it's generated)
- Full conversation history preserved across sessions
- Starter prompts for users who don't know where to begin
- Typing indicator while the AI is thinking
- Auto-scrolling message view
- Send with Enter, newline with Shift+Enter

#### User Accounts
- Email and password registration
- Secure login/logout
- 7-day persistent sessions (no re-login needed daily)

#### Freemium Subscription Model
- **Free tier:** 5 AI chats per month — enough to try the experience
- **Premium tier ($9.99/mo):** Unlimited chats
- Visual usage bar showing remaining free chats
- Clear upgrade prompts when the limit is reached (non-intrusive)

#### Stripe Billing Integration
- One-click upgrade to premium via Stripe Checkout
- Self-service billing management (update payment method, view invoices)
- Cancel anytime from the account page
- Handles payment failures gracefully (account goes to "past due" status)
- Automatic monthly chat-counter reset for free users

#### Landing Page
- Multi-section marketing page for visitors who aren't logged in
- Explains what the app is, who it's for, and how it works
- Sample conversation excerpt showing the AI's tone
- Call-to-action for joining

#### Account Management Page
- View current plan and usage
- Upgrade to premium
- Manage billing (redirects to Stripe portal)
- Cancel subscription with confirmation dialog
- Success banner after upgrading

---

### Not Yet Implemented

#### Memorial / Remembrance Pages
Referenced in the UI copy and landing page but not yet built. Envisioned as a place to create a lasting tribute to a pet — photos, stories, milestones.

#### Community Features
The landing page mentions community and shared experience, but there are no forums, groups, or social features yet.

#### Email Notifications
No transactional emails (welcome, password reset, subscription confirmations). Currently all communication happens in-app.

#### Admin Dashboard
No admin interface for viewing users, monitoring usage, or managing content.

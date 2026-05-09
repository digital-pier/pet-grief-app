import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing — Shared Leash",
  description:
    "Compassionate companionship for pet loss. Choose the plan that fits where you are in your healing journey.",
};

function PawIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <ellipse cx="14" cy="10" rx="5.5" ry="7" transform="rotate(-10 14 10)" />
      <ellipse cx="28" cy="8" rx="5" ry="6.5" transform="rotate(8 28 8)" />
      <ellipse cx="8" cy="22" rx="4.5" ry="6" transform="rotate(-20 8 22)" />
      <ellipse cx="38" cy="20" rx="4.5" ry="6" transform="rotate(20 38 20)" />
      <ellipse cx="23" cy="34" rx="13" ry="12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingCard({
  name,
  price,
  cadence,
  tagline,
  includesLabel,
  features,
  bestFor,
  ctaHref,
  ctaLabel,
  highlight = false,
  badge,
}: {
  name: string;
  price: string;
  cadence?: string;
  tagline: string;
  includesLabel: string;
  features: string[];
  bestFor: string;
  ctaHref: string;
  ctaLabel: string;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 ${
        highlight
          ? "bg-amber-900 border-amber-900 text-amber-50 shadow-lg lg:scale-[1.03]"
          : "bg-[#fdf6ee] border-amber-100"
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full shadow-sm">
          {badge}
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`text-xl font-semibold mb-2 ${
            highlight ? "text-amber-50" : "text-amber-900"
          }`}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span
            className={`text-4xl font-bold ${
              highlight ? "text-white" : "text-amber-950"
            }`}
          >
            {price}
          </span>
          {cadence && (
            <span
              className={`text-sm ${
                highlight ? "text-amber-200" : "text-amber-700"
              }`}
            >
              {cadence}
            </span>
          )}
        </div>
        <p
          className={`text-sm leading-relaxed ${
            highlight ? "text-amber-100" : "text-amber-800"
          }`}
        >
          {tagline}
        </p>
      </div>

      <div
        className={`text-xs uppercase tracking-wider font-medium mb-4 ${
          highlight ? "text-amber-200" : "text-amber-700"
        }`}
      >
        {includesLabel}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed">
            <CheckIcon
              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                highlight ? "text-amber-300" : "text-amber-600"
              }`}
            />
            <span className={highlight ? "text-amber-50" : "text-amber-900"}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={`text-xs uppercase tracking-wider font-medium mb-2 ${
          highlight ? "text-amber-200" : "text-amber-700"
        }`}
      >
        Best for
      </div>
      <p
        className={`text-sm leading-relaxed mb-8 ${
          highlight ? "text-amber-100" : "text-amber-800"
        }`}
      >
        {bestFor}
      </p>

      <Link
        href={ctaHref}
        className={`mt-auto text-center text-base font-medium px-6 py-3.5 rounded-2xl transition-colors shadow-sm ${
          highlight
            ? "bg-amber-500 hover:bg-amber-400 text-amber-950"
            : "bg-amber-600 hover:bg-amber-700 text-white"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

function FaqItem({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <details className="group bg-[#fdf6ee] border border-amber-100 rounded-2xl px-6 py-5 open:bg-white transition-colors">
      <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
        <span className="font-semibold text-amber-950 text-base">
          {question}
        </span>
        <span
          className="text-amber-600 text-2xl leading-none transition-transform group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="mt-4 text-amber-800 text-sm leading-relaxed">
        {children}
      </div>
    </details>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/sharedleash-logo.png"
              alt="SharedLeash"
              style={{ height: "60px", width: "auto" }}
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-base font-medium text-amber-900 hover:text-amber-950 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-base font-medium bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
        <div
          role="alert"
          className="bg-amber-900 text-amber-50 text-center text-xs sm:text-sm font-semibold tracking-wide px-4 py-2.5 border-t border-amber-950"
        >
          ⚠️ THIS SITE IS CURRENTLY IN TESTING MODE — IT IS NOT AN ACTIVE
          BUSINESS
        </div>
      </nav>

      <section className="px-6 pt-40 pb-16 text-center bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
        <div className="max-w-3xl mx-auto">
          <span className="text-amber-800 text-sm font-semibold tracking-widest uppercase mb-6 block">
            Pricing Plans
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-950 leading-[1.1] mb-6">
            No one should grieve alone.
          </h1>
          <p className="text-lg text-amber-800 leading-relaxed max-w-2xl mx-auto">
            Shared Leash is a compassionate companion designed to help pet
            owners navigate loss, preserve memories, and heal at their own
            pace.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 bg-gradient-to-b from-[#fce8d5] to-[#fdf6ee]">
        <div className="max-w-6xl mx-auto grid gap-8 md:gap-6 lg:gap-8 md:grid-cols-3 items-stretch">
          <PricingCard
            name="Essential Access"
            price="Free"
            tagline="For comfort in the hardest moments."
            includesLabel="Includes"
            features={[
              "10–20 daily AI messages",
              "Gentle grief support conversations",
              "Occasional healing prompts",
              "Save favorite memories/messages",
              "Basic remembrance timeline",
              "Emotional support when you need it most",
            ]}
            bestFor="Anyone beginning their grief journey who needs immediate support and companionship."
            ctaHref="/register?tier=free"
            ctaLabel="Start free"
          />
          <PricingCard
            name="Companion"
            price="$11.99"
            cadence="/month"
            tagline="A companion that remembers."
            includesLabel="Everything in Essential Access, plus"
            features={[
              "Extended daily conversations",
              "Personalized memory features",
              "Remembers your pet's name, stories, and memories",
              "Guided grief prompts",
              "Conversation continuity across sessions",
              "Light journaling support",
              "Priority response experience",
              "Anniversary and remembrance support",
            ]}
            bestFor="Pet owners looking for ongoing emotional support and a deeper healing connection."
            ctaHref="/register?tier=companion"
            ctaLabel="Choose Companion"
            highlight
            badge="★ Most Popular"
          />
          <PricingCard
            name="Support+"
            price="$21.99"
            cadence="/month"
            tagline="A complete healing and remembrance experience."
            includesLabel="Everything in Companion, plus"
            features={[
              "Voice interaction (when available)",
              "Structured grief healing paths",
              "Weekly emotional guidance check-ins",
              "Exportable memory journal & tribute timeline",
              "Guided reflection exercises",
              "Advanced journaling integration",
              "AI-assisted remembrance stories",
              "Premium remembrance experiences",
              "Early access to new features",
            ]}
            bestFor="Users wanting long-term healing tools, deeper reflection, and lasting remembrance experiences."
            ctaHref="/register?tier=support_plus"
            ctaLabel="Choose Support+"
          />
        </div>
      </section>

      <section className="px-6 py-24 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-8">
            Why Shared Leash?
          </h2>
          <p className="text-xl font-medium text-amber-900 mb-6">
            Losing a pet is losing family.
          </p>
          <div className="text-amber-800 text-lg leading-loose space-y-5">
            <p>
              Shared Leash was created to provide compassionate companionship
              during grief — a safe space to talk, remember, reflect, and heal
              without judgment.
            </p>
            <p>
              Whether you need comfort for a single night or support through a
              longer healing journey, Shared Leash is here for you.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-[#fdf6ee]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FaqItem question="Is Shared Leash therapy?">
              No. Shared Leash is an AI-powered emotional support companion and
              is not a replacement for licensed mental health care or crisis
              services.
            </FaqItem>
            <FaqItem question="Can I cancel anytime?">
              Yes. Paid subscriptions can be canceled anytime through your
              account settings.
            </FaqItem>
            <FaqItem question="Will Shared Leash remember my pet?">
              Yes. Paid plans include memory features that help preserve your
              pet&apos;s story, memories, and important moments over time.
            </FaqItem>
            <FaqItem question="Is my information private?">
              Your conversations and memories are treated with care and handled
              according to our{" "}
              <Link
                href="/privacy"
                className="text-amber-700 underline hover:text-amber-900 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </FaqItem>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24 text-center overflow-hidden bg-gradient-to-b from-[#fce8d5] to-[#fdf6ee]">
        <div className="relative max-w-xl mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center mb-6">
            <PawIcon className="w-5 h-5 text-amber-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-semibold text-amber-950 italic mb-8 leading-snug">
            &ldquo;Their memory deserves a place to live on.&rdquo;
          </p>
          <Link
            href="/register"
            className="bg-amber-600 hover:bg-amber-700 text-white text-base font-medium px-8 py-4 rounded-2xl transition-colors shadow-sm"
          >
            Join the Community
          </Link>
          <p className="text-amber-600 text-sm mt-4">
            Free to start. No commitment.
          </p>
        </div>
      </section>

      <footer className="bg-[#fdf6ee] border-t border-amber-100 px-6 py-8 text-center text-xs text-amber-700/70">
        <div className="flex justify-center gap-6 mb-2">
          <Link href="/terms" className="hover:text-amber-900 transition-colors">
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="hover:text-amber-900 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/pricing"
            className="hover:text-amber-900 transition-colors"
          >
            Pricing
          </Link>
        </div>
        <p>
          &copy; {new Date().getFullYear()} Shared Leash. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

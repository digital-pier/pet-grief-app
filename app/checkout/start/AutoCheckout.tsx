"use client";

import { useEffect, useRef, useState } from "react";

type PaidTier = "companion" | "support_plus";

const TIER_LABEL: Record<PaidTier, string> = {
  companion: "Companion",
  support_plus: "Support+",
};

export default function AutoCheckout({ tier }: { tier: PaidTier }) {
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const triggered = useRef(false);

  async function startCheckout() {
    setError(null);
    setRetrying(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start checkout. Please try again.");
        setRetrying(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setRetrying(false);
    }
  }

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;
    startCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-amber-900 font-semibold">We couldn&apos;t start your checkout.</p>
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
        <button
          type="button"
          onClick={startCheckout}
          disabled={retrying}
          className="rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-medium py-2.5 text-sm transition-colors"
        >
          {retrying ? "Trying again…" : `Try again — ${TIER_LABEL[tier]}`}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span
        aria-hidden="true"
        className="inline-block h-6 w-6 rounded-full border-2 border-amber-300 border-t-amber-700 animate-spin"
      />
      <p className="text-amber-900 font-semibold">Redirecting to secure checkout…</p>
      <p className="text-sm text-amber-700">
        Setting up your {TIER_LABEL[tier]} subscription with Stripe.
      </p>
    </div>
  );
}

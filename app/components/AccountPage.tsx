"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  userName: string;
  email: string;
  initialPlanTier: string;
  checkoutStatus: "success" | null;
}

const TIER_LABEL: Record<string, string> = {
  free: "Essential Access",
  companion: "Companion",
  support_plus: "Support+",
};

function tierLabel(tier: string): string {
  return TIER_LABEL[tier] ?? tier;
}

export default function AccountPage({
  userName,
  email,
  initialPlanTier,
  checkoutStatus,
}: Props) {
  const [planTier, setPlanTier] = useState(initialPlanTier);
  const [pollState, setPollState] = useState<"idle" | "polling" | "timeout">(
    checkoutStatus === "success" && initialPlanTier === "free" ? "polling" : "idle",
  );

  useEffect(() => {
    if (pollState !== "polling") return;
    let cancelled = false;
    const start = Date.now();
    const maxMs = 30_000;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await fetch("/api/me/plan", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { planTier?: string };
          if (data.planTier && data.planTier !== "free") {
            if (!cancelled) {
              setPlanTier(data.planTier);
              setPollState("idle");
            }
            return;
          }
        }
      } catch {
        // Swallow — we'll just retry on the next tick.
      }
      if (Date.now() - start >= maxMs) {
        if (!cancelled) setPollState("timeout");
        return;
      }
      setTimeout(poll, 2_000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [pollState]);

  const showSuccessCard = checkoutStatus === "success" && planTier !== "free";
  const showFinalizingCard = checkoutStatus === "success" && pollState === "polling";
  const showTimeoutCard = checkoutStatus === "success" && pollState === "timeout" && planTier === "free";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-900 tracking-tight">
              Shared Leash
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-amber-600 hover:text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            Back to chat
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        {showFinalizingCard && (
          <div
            role="status"
            className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 flex items-center gap-4"
          >
            <span
              aria-hidden="true"
              className="inline-block h-5 w-5 rounded-full border-2 border-amber-300 border-t-amber-700 animate-spin"
            />
            <div>
              <p className="text-amber-900 font-semibold">Finalizing your subscription…</p>
              <p className="text-amber-700 text-sm">
                This usually takes just a few seconds.
              </p>
            </div>
          </div>
        )}

        {showSuccessCard && (
          <div
            role="status"
            className="bg-green-50 border border-green-200 rounded-2xl shadow-sm p-6"
          >
            <p className="text-green-900 font-semibold mb-1">
              You&apos;re subscribed to {tierLabel(planTier)} — thank you.
            </p>
            <p className="text-green-800 text-sm">
              Your new features are active right now.
            </p>
          </div>
        )}

        {showTimeoutCard && (
          <div
            role="status"
            className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-6"
          >
            <p className="text-amber-900 font-semibold mb-1">
              Still finalizing your subscription.
            </p>
            <p className="text-amber-800 text-sm">
              Payment went through, but it&apos;s taking longer than usual to sync.
              Refresh this page in a moment, or reach out if it doesn&apos;t update.
            </p>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-bold text-amber-950">
            Your space, {userName}
          </h2>
          <p className="text-amber-700 mt-1">Manage your account.</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            Account details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-amber-700">Name</span>
              <span className="text-amber-900 font-medium">{userName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">Email</span>
              <span className="text-amber-900 font-medium">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">Plan</span>
              <span className="text-amber-900 font-medium">{tierLabel(planTier)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

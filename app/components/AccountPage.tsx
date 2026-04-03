"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  userName: string;
  planTier: string;
  subscriptionStatus: string;
  monthlyChatsUsed: number;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export default function AccountPage({
  userName,
  planTier,
  subscriptionStatus,
  monthlyChatsUsed,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: Props) {
  const searchParams = useSearchParams();
  const justUpgraded = searchParams.get("upgraded") === "true";
  const [loading, setLoading] = useState<string | null>(null);

  const isPremium = planTier === "premium";
  const periodEndDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  async function handleCheckout() {
    setLoading("checkout");
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  async function handlePortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/create-portal-session", {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(null);
  }

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you'd like to cancel? You'll still have access until the end of your current billing period."
    );
    if (!confirmed) return;
    handlePortal();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
      {/* Header */}
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
        {/* Greeting */}
        <div>
          <h2 className="text-3xl font-bold text-amber-950">
            Your space, {userName}
          </h2>
          <p className="text-amber-700 mt-1">
            Manage your account and subscription.
          </p>
        </div>

        {/* Upgrade welcome banner */}
        {justUpgraded && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-5">
            <p className="text-green-800 font-medium">
              Welcome to Shared Leash Premium. We&apos;re glad you&apos;re here.
            </p>
            <p className="text-green-700 text-sm mt-1">
              You now have unlimited conversations and full cross-session memory.
            </p>
          </div>
        )}

        {/* Plan card */}
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-amber-900">Your plan</h3>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                isPremium
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isPremium ? "Premium" : "Free Plan"}
            </span>
          </div>

          {!isPremium && (
            <>
              {/* Usage */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-amber-700 mb-2">
                  <span>Conversations this month</span>
                  <span>
                    {monthlyChatsUsed} of 5
                  </span>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-2.5">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full transition-all"
                    style={{
                      width: `${Math.min((monthlyChatsUsed / 5) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Upgrade section */}
              <div className="bg-[#fdf6ee] rounded-xl p-5 border border-amber-100">
                <h4 className="text-amber-900 font-medium mb-2">
                  Shared Leash Premium
                </h4>
                <p className="text-amber-700 text-sm leading-relaxed mb-4">
                  Unlimited conversations, full cross-session memory of your
                  pet&apos;s name and story, and access to memorial pages — all for
                  $9.99/month.
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={loading === "checkout"}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
                >
                  {loading === "checkout" ? "Loading…" : "Upgrade now"}
                </button>
              </div>
            </>
          )}

          {isPremium && (
            <>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-amber-700">Status</span>
                  <span className="text-amber-900 font-medium capitalize">
                    {cancelAtPeriodEnd
                      ? "Canceling at period end"
                      : subscriptionStatus}
                  </span>
                </div>
                {periodEndDate && (
                  <div className="flex justify-between">
                    <span className="text-amber-700">
                      {cancelAtPeriodEnd
                        ? "Access until"
                        : "Current period ends"}
                    </span>
                    <span className="text-amber-900 font-medium">
                      {periodEndDate}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-amber-700">Conversations</span>
                  <span className="text-amber-900 font-medium">Unlimited</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <button
                  onClick={handlePortal}
                  disabled={loading === "portal"}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
                >
                  {loading === "portal" ? "Loading…" : "Manage Billing"}
                </button>
                {!cancelAtPeriodEnd && (
                  <button
                    onClick={handleCancel}
                    className="text-sm text-amber-500 hover:text-amber-700 transition-colors underline underline-offset-2"
                  >
                    Cancel subscription
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

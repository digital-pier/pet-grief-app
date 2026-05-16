"use client";

import Link from "next/link";
import { useState } from "react";

type PaidTier = "companion" | "support_plus";

interface Props {
  tier: PaidTier;
  isAuthed: boolean;
  className: string;
  children: React.ReactNode;
}

export default function SubscribeButton({ tier, isAuthed, className, children }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthed) {
    return (
      <Link href={`/register?tier=${tier}`} className={className}>
        {children}
      </Link>
    );
  }

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start checkout. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-auto flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`${className} disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ResendButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleResend() {
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
        Verification email sent — check your inbox.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleResend}
        disabled={status === "loading"}
        className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-medium py-2.5 text-sm transition-colors"
      >
        {status === "loading" ? "Sending…" : "Resend verification email"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}

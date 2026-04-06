"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/password-reset";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🐾</span>
          <h1 className="text-3xl font-bold text-amber-900 mt-3">Shared Leash</h1>
          <p className="text-amber-700 text-sm mt-1">Reset your password</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-2">Forgot your password?</h2>
          <p className="text-sm text-amber-700 mb-6">
            Enter your email and we&apos;ll send you a link to reset it.
          </p>

          {state?.success ? (
            <div className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
              <p>{state.message}</p>
              <Link href="/login" className="block mt-3 font-medium text-amber-900 hover:underline">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form action={action} className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  placeholder="you@example.com"
                />
                {state?.errors?.email && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.email[0]}</p>
                )}
              </div>

              {state?.message && (
                <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full mt-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-medium py-2.5 text-sm transition-colors"
              >
                {pending ? "Sending..." : "Send reset link"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-amber-700 mt-6">
            <Link href="/login" className="font-medium text-amber-900 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

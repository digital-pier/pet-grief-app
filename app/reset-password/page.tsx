"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/app/actions/password-reset";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, undefined);

  if (!token) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
          <p className="text-amber-900 font-medium mb-4">Invalid reset link</p>
          <p className="text-sm text-amber-700 mb-4">
            This link appears to be invalid or incomplete.
          </p>
          <Link href="/forgot-password" className="text-sm font-medium text-amber-900 hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <img src="/sharedleash-logo.png" alt="SharedLeash" style={{height: "100px", width: "auto"}} className="mx-auto" />
        <p className="text-amber-700 text-sm mt-1">Choose a new password</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
        {state?.success ? (
          <div className="text-center">
            <p className="text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3 mb-4">
              {state.message}
            </p>
            <Link
              href="/login"
              className="inline-block rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 px-6 text-sm transition-colors"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <form action={action} className="flex flex-col gap-4">
            <input type="hidden" name="token" value={token} />

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-1">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="At least 8 characters"
              />
              {state?.errors?.password && (
                <p className="text-sm text-red-600 mt-1">{state.errors.password[0]}</p>
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
              {pending ? "Updating..." : "Set new password"}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex items-center justify-center px-4">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

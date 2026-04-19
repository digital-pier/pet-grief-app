"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/sharedleash-logo.png" alt="SharedLeash" style={{height: "100px", width: "auto"}} className="mx-auto" />
          <p className="text-amber-700 text-sm mt-1">A gentle space to grieve and remember</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-6">Create your account</h2>

          <form action={action} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-amber-800 mb-1">
                Your name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Alex"
              />
              {state?.errors?.name && (
                <p className="text-xs text-red-600 mt-1">{state.errors.name[0]}</p>
              )}
            </div>

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
                <p className="text-xs text-red-600 mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="At least 8 characters"
              />
              {state?.errors?.password && (
                <p className="text-xs text-red-600 mt-1">{state.errors.password[0]}</p>
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
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-amber-700 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

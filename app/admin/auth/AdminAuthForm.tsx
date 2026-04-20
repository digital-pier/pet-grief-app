"use client";

import { useActionState } from "react";
import { verifyAdminPassword } from "@/app/actions/admin-auth";

export default function AdminAuthForm() {
  const [state, action, pending] = useActionState(verifyAdminPassword, undefined);

  return (
    <form action={action} className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8 space-y-4">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-amber-900 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="w-full rounded-xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors disabled:opacity-50"
      >
        {pending ? "Verifying…" : "Continue to Admin"}
      </button>
    </form>
  );
}

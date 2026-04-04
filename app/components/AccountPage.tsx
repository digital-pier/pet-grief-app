"use client";

import Link from "next/link";

interface Props {
  userName: string;
  email: string;
}

export default function AccountPage({ userName, email }: Props) {
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
          </div>
        </div>
      </main>
    </div>
  );
}

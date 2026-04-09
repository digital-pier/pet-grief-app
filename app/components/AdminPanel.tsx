"use client";

import Link from "next/link";

interface UserRow {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  subscriptionStatus: string;
  planTier: string;
  crisisSignal: boolean;
  crisisSignalAt: string | null;
  monthlyChatsUsed: number;
  isAdmin: boolean;
}

interface Props {
  users: UserRow[];
  totalUsers: number;
}

export default function AdminPanel({ users, totalUsers }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-amber-900 tracking-tight">
              Admin Panel
            </h1>
            <p className="text-sm text-amber-700">
              {totalUsers} registered {totalUsers === 1 ? "user" : "users"}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-amber-600 hover:text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            Back to chat
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50 border-b border-amber-100">
                  <th className="text-left px-4 py-3 font-semibold text-amber-900">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-900">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-900">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-900">Plan</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-900">Chats</th>
                  <th className="text-left px-4 py-3 font-semibold text-amber-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-amber-50 hover:bg-amber-50/50">
                    <td className="px-4 py-3 text-amber-950">
                      {user.name}
                      {user.isAdmin && (
                        <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
                          admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-amber-700">{user.email}</td>
                    <td className="px-4 py-3 text-amber-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.planTier === "free"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {user.planTier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-700">{user.monthlyChatsUsed}</td>
                    <td className="px-4 py-3">
                      {user.crisisSignal && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          crisis signal
                          {user.crisisSignalAt && (
                            <span className="ml-1 text-red-500">
                              {new Date(user.crisisSignalAt).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

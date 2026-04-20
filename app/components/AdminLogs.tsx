"use client";

import Link from "next/link";
import { useState } from "react";

interface LogRow {
  id: number;
  requestId: string;
  userId: number;
  userEmail: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  serviceTier: string;
  createdAt: string;
}

interface Props {
  logs: LogRow[];
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(new Date(iso)).replace(",", "");
}

function formatRefreshTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

export default function AdminLogs({ logs }: Props) {
  const [detail, setDetail] = useState<LogRow | null>(null);
  const now = new Date().toISOString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-4xl">🐾</span>
          <div className="flex-1 flex items-center gap-6">
            <h1 className="text-2xl font-bold text-amber-900 tracking-tight">Admin</h1>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin" className="text-amber-600 hover:text-amber-900 transition-colors">
                Users
              </Link>
              <span className="font-semibold text-amber-900 border-b-2 border-amber-400 pb-0.5">
                Logs
              </span>
            </nav>
          </div>
          <Link
            href="/"
            className="text-sm text-amber-600 hover:text-amber-900 border border-amber-200 hover:border-amber-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            Back to chat
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-amber-950">Logs</h2>
          <p className="text-sm text-amber-700">Last refresh time: {formatRefreshTime(now)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-100">
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase whitespace-nowrap">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase">
                    ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase">
                    Model
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase whitespace-nowrap">
                    Input<br />Tokens
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase whitespace-nowrap">
                    Output<br />Tokens
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase whitespace-nowrap">
                    Service<br />Tier
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-amber-900 tracking-wide uppercase">
                    Request
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-amber-500">
                      No logs yet.
                    </td>
                  </tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-amber-50 hover:bg-amber-50/40">
                    <td className="px-4 py-3 text-amber-800 whitespace-nowrap font-mono text-xs">
                      {formatTime(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-amber-900 whitespace-nowrap">
                      {log.requestId}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-amber-900 whitespace-nowrap">
                      {log.model}
                    </td>
                    <td className="px-4 py-3 text-amber-800">
                      <span className="inline-flex items-center gap-1.5">
                        {(log.cacheReadTokens > 0 || log.cacheCreationTokens > 0) && (
                          <span title={`Cache read: ${log.cacheReadTokens} / Cache write: ${log.cacheCreationTokens}`}
                            className="text-amber-400">⊘</span>
                        )}
                        {log.inputTokens}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-amber-800">{log.outputTokens}</td>
                    <td className="px-4 py-3 text-amber-800">Streaming</td>
                    <td className="px-4 py-3 text-amber-800 capitalize">{log.serviceTier}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDetail(log)}
                        className="w-6 h-6 rounded-full border border-amber-300 text-amber-500 hover:border-amber-500 hover:text-amber-700 flex items-center justify-center text-xs transition-colors"
                        title="View details"
                      >
                        ⓘ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {detail && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-amber-100 w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-amber-900">Request Detail</h3>
              <button onClick={() => setDetail(null)} className="text-amber-400 hover:text-amber-700 text-xl">×</button>
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ["Request ID", detail.requestId],
                ["Time", formatTime(detail.createdAt)],
                ["User", detail.userEmail],
                ["Model", detail.model],
                ["Input tokens", detail.inputTokens],
                ["Output tokens", detail.outputTokens],
                ["Cache read tokens", detail.cacheReadTokens],
                ["Cache write tokens", detail.cacheCreationTokens],
                ["Type", "Streaming"],
                ["Service tier", detail.serviceTier],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex gap-3">
                  <dt className="w-44 shrink-0 text-amber-600">{label}</dt>
                  <dd className="text-amber-950 font-mono break-all">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

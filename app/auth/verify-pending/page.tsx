import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { usersDb } from "@/lib/db";
import ResendButton from "./ResendButton";

export default async function VerifyPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.emailVerified) redirect("/");

  // Session JWT may be stale — check DB for actual verification status
  const user = await usersDb.findById(session.userId);
  if (user?.emailVerified) {
    redirect("/api/auth/refresh-session");
  }

  const { error } = await searchParams;

  let errorMessage: string | null = null;
  if (error === "expired") {
    errorMessage = "That verification link has expired. Request a new one below.";
  } else if (error === "invalid") {
    errorMessage = "That verification link is invalid or has already been used. Request a new one below.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/sharedleash-logo-transparent.png" alt="SharedLeash" style={{height: "100px", width: "auto"}} className="mx-auto" />
          <p className="text-amber-700 text-sm mt-1">A gentle space to grieve and remember</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8">
          <h2 className="text-xl font-semibold text-amber-900 mb-3">Check your email</h2>
          <p className="text-sm text-amber-700 leading-relaxed mb-2">
            We sent a verification link to:
          </p>
          <p className="text-sm font-medium text-amber-900 bg-amber-50 rounded-xl px-4 py-2 mb-4 break-all">
            {session.email}
          </p>
          <p className="text-sm text-amber-700 leading-relaxed mb-6">
            Click the link in that email to access your companion. You can still log in, but
            the chatbot will be available once your email is verified.
          </p>

          {errorMessage && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-4">
              {errorMessage}
            </p>
          )}

          <ResendButton />

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

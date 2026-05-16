export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { isPaidTier } from "@/lib/stripe";
import AutoCheckout from "./AutoCheckout";

export default async function CheckoutStartPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { tier } = await searchParams;
  if (!isPaidTier(tier)) redirect("/pricing");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-amber-100 p-8 text-center">
        <AutoCheckout tier={tier} />
        <p className="text-xs text-amber-700 mt-6">
          Changed your mind?{" "}
          <Link href="/pricing" className="font-medium text-amber-900 underline">
            Back to pricing
          </Link>
        </p>
      </div>
    </div>
  );
}

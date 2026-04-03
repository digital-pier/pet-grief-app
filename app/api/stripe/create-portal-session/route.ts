export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.stripeCustomerId) {
    return new Response(JSON.stringify({ error: "No billing account found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return new Response(JSON.stringify({ error: "Billing is not available right now" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/account`,
  });

  return new Response(JSON.stringify({ url: portalSession.url }), {
    headers: { "Content-Type": "application/json" },
  });
}

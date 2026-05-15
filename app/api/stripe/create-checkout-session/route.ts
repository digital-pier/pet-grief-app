export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe, isPaidTier, priceIdForTier } from "@/lib/stripe";

function appUrl(): string {
  return process.env.APP_URL || "http://localhost:3000";
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }
  if (!user.emailVerified) {
    return Response.json({ error: "Email not verified" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const tier = (body as { tier?: unknown })?.tier;
  if (!isPaidTier(tier)) {
    return Response.json({ error: "Invalid tier" }, { status: 400 });
  }

  const stripe = getStripe();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: String(user.id) },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceIdForTier(tier), quantity: 1 }],
    success_url: `${appUrl()}/account?checkout=success`,
    cancel_url: `${appUrl()}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { userId: String(user.id), tier } },
    metadata: { userId: String(user.id), tier },
  });

  if (!checkout.url) {
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
  return Response.json({ url: checkout.url });
}

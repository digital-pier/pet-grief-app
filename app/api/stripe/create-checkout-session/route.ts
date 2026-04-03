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
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    return new Response(JSON.stringify({ error: "Stripe price not configured" }), {
      status: 500,
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

  // Create or reuse Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: String(user.id) },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/account?upgraded=true`,
    cancel_url: `${appUrl}/account`,
  });

  return new Response(JSON.stringify({ url: checkoutSession.url }), {
    headers: { "Content-Type": "application/json" },
  });
}

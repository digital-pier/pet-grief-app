export const dynamic = "force-dynamic";

import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, tierForPriceId } from "@/lib/stripe";

function unixToDate(value: number | null | undefined): Date | null {
  return typeof value === "number" ? new Date(value * 1000) : null;
}

function periodFromSubscription(sub: Stripe.Subscription): {
  start: Date | null;
  end: Date | null;
} {
  const item = sub.items.data[0] as
    | (Stripe.SubscriptionItem & {
        current_period_start?: number;
        current_period_end?: number;
      })
    | undefined;
  const legacy = sub as unknown as {
    current_period_start?: number;
    current_period_end?: number;
  };
  return {
    start: unixToDate(item?.current_period_start ?? legacy.current_period_start),
    end: unixToDate(item?.current_period_end ?? legacy.current_period_end),
  };
}

async function syncSubscription(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (!user) {
    console.error(`[STRIPE WEBHOOK] No user found for customer ${customerId}`);
    return;
  }

  const priceId = sub.items.data[0]?.price.id;
  const tier = priceId ? tierForPriceId(priceId) : null;
  const { start, end } = periodFromSubscription(sub);

  const active = sub.status === "active" || sub.status === "trialing";

  await prisma.user.update({
    where: { id: user.id },
    data: {
      planTier: active && tier ? tier : "free",
      subscriptionStatus: sub.status,
      currentPeriodStart: start,
      currentPeriodEnd: end,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });

  const existing = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: sub.id },
    select: { id: true },
  });
  const subData = {
    status: sub.status,
    planTier: tier ?? "free",
    currentPeriodStart: start ?? new Date(0),
    currentPeriodEnd: end ?? new Date(0),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  };
  if (existing) {
    await prisma.subscription.update({ where: { id: existing.id }, data: subData });
  } else {
    await prisma.subscription.create({
      data: { userId: user.id, stripeSubscriptionId: sub.id, ...subData },
    });
  }
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planTier: "free",
        subscriptionStatus: "canceled",
        cancelAtPeriodEnd: false,
      },
    });
  }
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: sub.id },
    data: { status: "canceled", cancelAtPeriodEnd: false },
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Misconfigured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkout = event.data.object as Stripe.Checkout.Session;
        if (checkout.mode === "subscription" && checkout.subscription) {
          const subId =
            typeof checkout.subscription === "string"
              ? checkout.subscription
              : checkout.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      }
      default:
        // Ignore unrelated events
        break;
    }
  } catch (err) {
    console.error(`[STRIPE WEBHOOK] Handler failed for ${event.type}`, err);
    return new Response("Handler error", { status: 500 });
  }

  return Response.json({ received: true });
}

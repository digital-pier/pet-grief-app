export const dynamic = "force-dynamic";

import type Stripe from "stripe";

function getCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): string {
  return typeof customer === "string" ? customer : customer.id;
}

function getPeriodDates(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    start: new Date(item.current_period_start * 1000),
    end: new Date(item.current_period_end * 1000),
  };
}

export async function POST(request: Request) {
  const { prisma } = await import("@/lib/prisma");
  const { getStripe } = await import("@/lib/stripe");

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing signature or webhook secret", { status: 400 });
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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = getCustomerId(subscription.customer);

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (!user) break;

      const status =
        subscription.status === "active" ? "active" : subscription.status;
      const planTier =
        subscription.status === "active" ? "premium" : user.planTier;
      const period = getPeriodDates(subscription);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: status,
          planTier,
          currentPeriodStart: period.start,
          currentPeriodEnd: period.end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });

      const existingSub = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (existingSub) {
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            status,
            planTier,
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeSubscriptionId: subscription.id,
            status,
            planTier,
            currentPeriodStart: period.start,
            currentPeriodEnd: period.end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = getCustomerId(subscription.customer);

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "canceled",
          planTier: "free",
          cancelAtPeriodEnd: false,
        },
      });

      const sub = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "canceled", planTier: "free" },
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;
      if (!customerId) break;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { subscriptionStatus: "past_due" },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;
      if (!customerId) break;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          subscriptionStatus: "active",
          monthlyChatsUsed: 0,
          monthlyChatsResetAt: new Date(),
        },
      });
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

function appUrl(): string {
  return process.env.APP_URL || "http://localhost:3000";
}

export async function POST() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }
  if (!user.stripeCustomerId) {
    return Response.json({ error: "No billing account" }, { status: 400 });
  }

  const portal = await getStripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl()}/account`,
  });

  return Response.json({ url: portal.url });
}

export const dynamic = "force-dynamic";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { planTier: true, subscriptionStatus: true },
  });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

  return Response.json(user);
}

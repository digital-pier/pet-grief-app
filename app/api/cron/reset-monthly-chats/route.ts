export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[CRON] CRON_SECRET not configured");
    return new Response("Misconfigured", { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await prisma.user.updateMany({
    data: { monthlyChatsUsed: 0, monthlyChatsResetAt: new Date() },
  });

  return Response.json({ reset: result.count });
}

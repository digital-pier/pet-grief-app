export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await prisma.user.updateMany({
    where: { planTier: "free" },
    data: {
      monthlyChatsUsed: 0,
      monthlyChatsResetAt: new Date(),
    },
  });

  return new Response(
    JSON.stringify({ reset: result.count, timestamp: new Date().toISOString() }),
    { headers: { "Content-Type": "application/json" } }
  );
}

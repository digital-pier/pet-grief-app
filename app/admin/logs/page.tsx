export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAdminVerification } from "@/lib/admin-session";
import AdminLogs from "@/app/components/AdminLogs";

export default async function AdminLogsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { prisma } = await import("@/lib/prisma");
  const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!currentUser?.isAdmin) redirect("/");

  const verified = await getAdminVerification();
  if (!verified || verified.userId !== session.userId) redirect("/admin/auth");

  const logs = await prisma.chatLog.findMany({
    take: 200,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } } },
  });

  return (
    <AdminLogs
      logs={logs.map((l) => ({
        id: l.id,
        requestId: l.requestId,
        userId: l.userId,
        userEmail: l.user.email,
        model: l.model,
        inputTokens: l.inputTokens,
        outputTokens: l.outputTokens,
        cacheCreationTokens: l.cacheCreationTokens,
        cacheReadTokens: l.cacheReadTokens,
        serviceTier: l.serviceTier,
        createdAt: l.createdAt.toISOString(),
      }))}
    />
  );
}

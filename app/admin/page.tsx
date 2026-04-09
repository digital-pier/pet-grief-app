export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminPanel from "@/app/components/AdminPanel";

export default async function Admin() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { prisma } = await import("@/lib/prisma");

  const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!currentUser?.isAdmin) redirect("/");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      subscriptionStatus: true,
      planTier: true,
      crisisSignal: true,
      crisisSignalAt: true,
      monthlyChatsUsed: true,
      isAdmin: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminPanel
      users={users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        crisisSignalAt: u.crisisSignalAt?.toISOString() ?? null,
      }))}
      totalUsers={users.length}
    />
  );
}

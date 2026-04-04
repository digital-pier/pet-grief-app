export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AccountPage from "@/app/components/AccountPage";

export default async function Account() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/login");

  return (
    <AccountPage
      userName={user.name}
      planTier={user.planTier}
      subscriptionStatus={user.subscriptionStatus}
      monthlyChatsUsed={user.monthlyChatsUsed}
      currentPeriodEnd={user.currentPeriodEnd?.toISOString() ?? null}
      cancelAtPeriodEnd={user.cancelAtPeriodEnd}
    />
  );
}

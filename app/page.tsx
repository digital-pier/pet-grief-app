import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ChatInterface from "@/app/components/ChatInterface";
import LandingPage from "@/app/components/LandingPage";

export default async function Home() {
  const session = await getSession();
  if (!session) return <LandingPage />;

  const { prisma } = await import("@/lib/prisma");
  const { conversationsDb } = await import("@/lib/db");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) redirect("/api/logout");

  const history = await conversationsDb.getMessages(session.userId);

  return (
    <ChatInterface
      initialMessages={history}
      userName={user.name}
    />
  );
}

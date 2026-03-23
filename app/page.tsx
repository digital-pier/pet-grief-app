import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { usersDb, conversationsDb } from "@/lib/db";
import ChatInterface from "@/app/components/ChatInterface";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = usersDb.findById(session.userId);
  if (!user) redirect("/login");

  const history = conversationsDb.getMessages(session.userId);

  return <ChatInterface initialMessages={history} userName={user.name} />;
}

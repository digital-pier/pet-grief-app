import { randomUUID } from "crypto";
import { getSession } from "@/lib/session";
import { usersDb } from "@/lib/db";
import { sendEmailVerificationEmail } from "@/lib/email";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await usersDb.findById(session.userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerified) {
    return Response.json({ error: "Email already verified" }, { status: 400 });
  }

  const token = randomUUID();
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await usersDb.setEmailVerificationToken(user.id, token, expiry);

  try {
    await sendEmailVerificationEmail(user.email, user.name, token);
  } catch {
    return Response.json({ error: "Failed to send email. Please try again." }, { status: 500 });
  }

  return Response.json({ success: true });
}

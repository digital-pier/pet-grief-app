"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createAdminVerification } from "@/lib/admin-session";

export async function verifyAdminPassword(
  _state: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const password = (formData.get("password") as string | null) ?? "";

  const session = await getSession();
  if (!session) redirect("/login");

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.isAdmin) redirect("/");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Incorrect password." };

  await createAdminVerification(session.userId);
  redirect("/admin");
}

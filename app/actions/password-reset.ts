"use server";

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { usersDb } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export type PasswordResetFormState =
  | { success?: boolean; message?: string; errors?: { email?: string[]; password?: string[] } }
  | undefined;

const GENERIC_SUCCESS = "If an account with that email exists, we've sent a reset link.";

export async function requestPasswordReset(
  state: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";

  if (!email.includes("@")) {
    return { errors: { email: ["Please enter a valid email."] } };
  }

  const user = await usersDb.findByEmail(email);
  if (!user) {
    // Don't reveal whether the account exists
    return { success: true, message: GENERIC_SUCCESS };
  }

  const token = randomUUID();
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await usersDb.setResetToken(email, token, expiry);

  try {
    await sendPasswordResetEmail(email, token);
  } catch {
    return { message: "Failed to send reset email. Please try again later." };
  }

  return { success: true, message: GENERIC_SUCCESS };
}

export async function resetPassword(
  state: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
  const token = (formData.get("token") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!token) {
    return { message: "Invalid or missing reset token." };
  }

  if (password.length < 8) {
    return { errors: { password: ["Password must be at least 8 characters."] } };
  }

  const user = await usersDb.findByResetToken(token);
  if (!user) {
    return { message: "This reset link is invalid or has already been used." };
  }

  // Check expiry — need to query the raw row for the expiry field
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.user.findUnique({
    where: { passwordResetToken: token },
    select: { passwordResetExpiry: true },
  });

  if (!row?.passwordResetExpiry || row.passwordResetExpiry < new Date()) {
    return { message: "This reset link has expired. Please request a new one." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await usersDb.updatePassword(user.email, passwordHash);

  return { success: true, message: "Password updated! You can now sign in with your new password." };
}

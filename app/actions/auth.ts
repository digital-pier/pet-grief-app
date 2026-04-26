"use server";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { usersDb } from "@/lib/db";
import { sendAdminRegistrationNotification, sendEmailVerificationEmail } from "@/lib/email";
import { createSession, deleteSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

export type AuthFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        acknowledgement?: string[];
      };
      message?: string;
    }
  | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}

async function getClientIp(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const ip = await getClientIp();
  if (!rateLimit(`signup:${ip}`, 3, 60 * 60 * 1000)) {
    return { message: "Too many registration attempts. Please try again later." };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const acknowledgement = formData.get("acknowledgement");

  const errors: NonNullable<AuthFormState>["errors"] = {};

  if (name.length < 2) errors.name = ["Name must be at least 2 characters."];
  if (!EMAIL_RE.test(email)) errors.email = ["Please enter a valid email address."];

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = [passwordError];

  if (!acknowledgement) errors.acknowledgement = ["You must acknowledge this before registering."];

  if (Object.keys(errors).length > 0) return { errors };

  const existing = await usersDb.findByEmail(email);
  if (existing) {
    return { errors: { email: ["An account with this email already exists."] } };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let user;
  try {
    user = await usersDb.create(name, email, passwordHash);
  } catch {
    return { message: "Something went wrong creating your account. Please try again." };
  }

  const verificationToken = randomUUID();
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await usersDb.setEmailVerificationToken(user.id, verificationToken, verificationExpiry);

  await createSession(user.id, email, null);

  sendEmailVerificationEmail(email, name, verificationToken).catch(() => {});
  sendAdminRegistrationNotification(email, name).catch(() => {});

  redirect("/auth/verify-pending");
}

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const ip = await getClientIp();
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return { message: "Too many login attempts. Please try again in 15 minutes." };
  }

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { message: "Please enter your email and password." };
  }

  const user = await usersDb.findByEmail(email);
  if (!user) {
    // Generic message — don't reveal whether the email is registered
    return { message: "Invalid email or password." };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return {
      message: `Account temporarily locked after too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.`,
    };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    await usersDb.recordFailedLogin(user.id);
    return { message: "Invalid email or password." };
  }

  await usersDb.clearFailedLogin(user.id);
  await createSession(user.id, user.email, user.emailVerified);
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

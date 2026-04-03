"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { usersDb } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type AuthFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  const errors: NonNullable<AuthFormState>["errors"] = {};

  if (name.length < 2) errors.name = ["Name must be at least 2 characters."];
  if (!email.includes("@")) errors.email = ["Please enter a valid email."];
  if (password.length < 8) errors.password = ["Password must be at least 8 characters."];

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

  await createSession(user.id);
  redirect("/");
}

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { message: "Please enter your email and password." };
  }

  const user = await usersDb.findByEmail(email);
  if (!user) {
    return { message: "No account found with that email." };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { message: "Incorrect password. Please try again." };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

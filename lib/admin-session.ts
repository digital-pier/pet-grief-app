import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return new TextEncoder().encode(secret + ":admin");
}

export async function createAdminVerification(userId: number): Promise<void> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getKey());

  const cookieStore = await cookies();
  cookieStore.set("admin_verified", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    sameSite: "lax",
    path: "/",
  });
}

export async function getAdminVerification(): Promise<{ userId: number } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_verified")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return { userId: payload.userId as number };
  } catch {
    return null;
  }
}

export async function deleteAdminVerification(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_verified");
}

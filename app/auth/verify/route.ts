import { NextRequest, NextResponse } from "next/server";
import { usersDb } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth/verify-pending?error=invalid", request.url));
  }

  const user = await usersDb.findByEmailVerificationToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/auth/verify-pending?error=invalid", request.url));
  }

  // Check expiry separately (findByEmailVerificationToken doesn't filter on it)
  const { prisma } = await import("@/lib/prisma");
  const row = await prisma.user.findUnique({
    where: { emailVerificationToken: token },
    select: { emailVerificationExpiry: true },
  });

  if (!row?.emailVerificationExpiry || row.emailVerificationExpiry < new Date()) {
    return NextResponse.redirect(new URL("/auth/verify-pending?error=expired", request.url));
  }

  await usersDb.markEmailVerified(user.id);
  await createSession(user.id, user.email, new Date());

  return NextResponse.redirect(new URL("/", request.url));
}

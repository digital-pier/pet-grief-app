import { NextRequest, NextResponse } from "next/server";
import { getSession, createSession } from "@/lib/session";
import { usersDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await usersDb.findById(session.userId);
  if (!user?.emailVerified) {
    return NextResponse.redirect(new URL("/auth/verify-pending", request.url));
  }

  await createSession(user.id, user.email, user.emailVerified);
  return NextResponse.redirect(new URL("/", request.url));
}

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const publicRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
// "/" is open to everyone — unauthenticated users see the landing page,
// authenticated users see the chat. Neither should be redirected away.
const openRoutes = ["/", "/terms"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isOpen = openRoutes.includes(pathname);

  const sessionCookie = request.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const isAuthenticated = !!session;

  if (!isAuthenticated && !isPublic && !isOpen) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

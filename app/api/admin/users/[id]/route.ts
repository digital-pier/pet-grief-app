import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prisma } = await import("@/lib/prisma");
  const currentUser = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!currentUser?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const targetId = parseInt(id, 10);
  if (isNaN(targetId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.isAdmin) return NextResponse.json({ error: "Cannot delete admin accounts" }, { status: 400 });

  await prisma.subscription.deleteMany({ where: { userId: targetId } });
  await prisma.conversation.deleteMany({ where: { userId: targetId } });
  await prisma.user.delete({ where: { id: targetId } });

  return NextResponse.json({ ok: true });
}

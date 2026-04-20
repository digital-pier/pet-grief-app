import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminAuthForm from "./AdminAuthForm";

export default async function AdminAuthPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user?.isAdmin) redirect("/");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf6ee] to-[#fce8d5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🐾</span>
          <h1 className="text-2xl font-bold text-amber-900 mt-3">Admin Access</h1>
          <p className="text-sm text-amber-700 mt-1">Re-enter your password to continue</p>
        </div>
        <AdminAuthForm />
      </div>
    </div>
  );
}

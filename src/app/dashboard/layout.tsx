// src/app/dashboard/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-sky-50">
      <Sidebar user={session.user} />

      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto w-full p-8">{children}</main>
      </div>
    </div>
  );
}

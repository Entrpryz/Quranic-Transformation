import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  console.log("AdminLayout Session:", session);

  if (!session || session.role !== UserRole.ADMIN) {
    console.log(
      "AdminLayout: Redirecting to /, session valid:",
      !!session,
      "role:",
      session?.role
    );
    redirect("/"); // Or /login, but / prevents leaking admin existence slightly more? User implies redirect.
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

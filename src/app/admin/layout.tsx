import React from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import AdminSidebar from "@/components/AdminSidebar";
import { getSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // secure session check
  const session = await getSession();

  if (!session || session.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40 font-sans text-foreground">
      {/* Sidebar: 
        Hidden on mobile by default (hidden md:block). 
        You would typically add a Sheet/Drawer component for mobile navigation.
      */}
      <aside className="hidden border-r bg-background md:block">
        <AdminSidebar className="h-full" />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-4 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
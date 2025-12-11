/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Users,
  BookOpen,
  ShieldBan,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const NavItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: any;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-red-500/10 text-red-500 border border-red-500/20"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
        )}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900 w-[240px]">
      <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <ShieldBan className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white tracking-wide">
            Admin
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Dashboard</span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1">
        <NavItem href="/admin" label="Overview" icon={LayoutDashboard} />
        <NavItem href="/admin/users" label="User Management" icon={Users} />
        <NavItem
          href="/admin/lessons"
          label="Lessons & Access"
          icon={BookOpen}
        />
      </div>

      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} />
          <span>Exit Admin</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

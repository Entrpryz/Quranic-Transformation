"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  ShieldBan,
  LayoutDashboard,
  LogOut,
  Shield,
  ChevronsUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Lessons & Access",
      href: "/admin/lessons",
      icon: BookOpen,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen w-[260px] border-r bg-card text-card-foreground",
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <ShieldBan className="h-6 w-6 text-primary" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-lg tracking-tight">AdminPanel</span>
          <span className="text-xs text-muted-foreground font-mono">
            v1.0.0
          </span>
        </div>
      </div>

      <Separator />

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-2">
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Platform
          </h4>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 px-3 transition-all",
                  isActive
                    ? "bg-secondary font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                asChild
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Sidebar Footer */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-between px-2 py-3 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">Administrator</span>
                  <span className="text-xs text-muted-foreground">
                    System Admin
                  </span>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px]">
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
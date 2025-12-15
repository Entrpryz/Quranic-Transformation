/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  StickyNote,
  Download,
  BookOpen,
  X,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  LogOut,
  User,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onChangeView: (view: any) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  savedNotesCount: number;
  downloadsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeView,
  onChangeView,
  activeCategory,
  onSelectCategory,
  savedNotesCount,
  downloadsCount,
}) => {
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  const isAdmin = userData?.role === "ADMIN";

  const NavItem = ({ id, label, icon: Icon, count, className }: any) => {
    const isActive = activeView === id;
    return (
      <button
        onClick={() => {
          onChangeView(id);
          onClose();
        }}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative overflow-hidden",
          isActive
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent",
          className
        )}
      >
        {isActive && (
          <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 rounded-r-full" />
        )}
        <div className="flex items-center gap-3 pl-1">
          <Icon
            size={18}
            className={cn(
              isActive
                ? "text-emerald-400"
                : "text-zinc-500 group-hover:text-zinc-300"
            )}
          />
          <span>{label}</span>
        </div>
        {count > 0 && (
          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-[10px] h-5 px-1.5 min-w-[20px] justify-center"
          >
            {count}
          </Badge>
        )}
      </button>
    );
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-full lg:w-[280px]">
      {/* Brand Header */}
      <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col -space-y-0.5">
            <span className="font-bold text-sm text-white tracking-tight">
              Quranic
            </span>
            <span className="text-[10px] text-emerald-500 font-medium tracking-widest uppercase">
              Transformation
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-3 mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Library
            </p>
          </div>
          <NavItem id="home" label="Syllabus" icon={Home} />
          <NavItem
            id="notes"
            label="Reflections"
            icon={StickyNote}
            count={savedNotesCount}
          />
          <NavItem
            id="downloads"
            label="Offline Access"
            icon={Download}
            count={downloadsCount}
          />
        </div>

        {/* Modules Categories */}
        <div className="space-y-1 hidden lg:block">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            Modules <Sparkles size={10} className="text-amber-500" />
          </p>
          <div className="space-y-0.5">
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onChangeView("home");
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all duration-200 group border border-transparent",
                  activeCategory === cat && activeView === "home"
                    ? "bg-zinc-900 text-white border-zinc-800 font-medium"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                )}
              >
                <span>{cat}</span>
                {activeCategory === cat && activeView === "home" && (
                  <ChevronRight size={14} className="text-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Section (Conditional) */}
        {isAdmin && (
          <div className="space-y-1 pt-4 border-t border-zinc-800/50">
            <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              Administration
            </p>
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
            >
              <ShieldCheck size={18} />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900/80 transition-colors cursor-default group">
          <Avatar className="h-9 w-9 border border-zinc-700">
            <AvatarImage src={userData?.image} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
              {userData?.name ? (
                userData.name.charAt(0).toUpperCase()
              ) : (
                <User size={14} />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">
              {userData?.name || "Student User"}
            </span>
            <span
              className="text-[10px] text-zinc-500 truncate w-[140px]"
              title={userData?.email}
            >
              {userData?.email || "Signed In"}
            </span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/auth/logout"
                  className="ml-auto text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <LogOut size={16} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>Log out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen w-[280px] border-r border-zinc-800 bg-zinc-950 z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] animate-in slide-in-from-left duration-300 shadow-2xl shadow-black border-r border-zinc-800">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

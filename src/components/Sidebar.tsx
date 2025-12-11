/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Home,
  StickyNote,
  Download,
  BookOpen,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

  const NavItem = ({ id, label, icon: Icon, count }: any) => {
    const isActive = activeView === id;
    return (
      <button
        onClick={() => {
          onChangeView(id);
          onClose();
        }}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
        )}
      >
        <div className="flex items-center gap-3">
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
            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-[10px] h-5 px-1.5"
          >
            {count}
          </Badge>
        )}
      </button>
    );
  };

  const content = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 w-[280px]">
      {/* Brand */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white tracking-wide">
              Quranic
            </span>
            <span className="text-[10px] text-emerald-500 font-medium tracking-widest uppercase">
              Transformation
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-zinc-500 hover:text-white p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        {/* Main Nav */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
            Library
          </p>
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

        {/* Categories (Desktop) */}
        <div className="space-y-1 hidden lg:block">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-2">
            Modules <Sparkles size={10} className="text-amber-500" />
          </p>
          <div className="space-y-1">
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onChangeView("home");
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group border border-transparent",
                  activeCategory === cat && activeView === "home"
                    ? "bg-zinc-900 text-white border-zinc-800"
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
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">
              {userData?.name || "Student User"}
            </span>
            <span
              className="text-[10px] text-zinc-500 w-[160px] truncate"
              title={userData?.email}
            >
              {userData?.email || "v3.0.0 Stable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen z-40">
        {content}
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
          />
          <div className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-300 shadow-2xl shadow-black">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

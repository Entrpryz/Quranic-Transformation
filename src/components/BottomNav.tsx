/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Home, StickyNote, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeView: string;
  onChangeView: (view: any) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onChangeView }) => {
  const NavItem = ({ id, icon: Icon, label }: any) => {
    const isActive = activeView === id;
    return (
      <button
        onClick={() => {
          onChangeView(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative",
          isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        {/* Active Indicator Line */}
        {isActive && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-in fade-in zoom-in" />
        )}

        <Icon
          size={22}
          strokeWidth={isActive ? 2.5 : 2}
          className={isActive ? "drop-shadow-sm" : ""}
        />
        <span className="text-[10px] font-medium tracking-tight">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-16 lg:hidden safe-area-pb">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800" />

      <div className="grid grid-cols-3 h-full relative z-10">
        <NavItem id="home" icon={Home} label="Syllabus" />
        <NavItem id="notes" icon={StickyNote} label="Reflections" />
        <NavItem id="downloads" icon={Download} label="Library" />
      </div>
    </div>
  );
};

export default BottomNav;
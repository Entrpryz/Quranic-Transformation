/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Home, StickyNote, Download } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


interface BottomNavProps {
  activeView: string;
  onChangeView: (view: any) => void;
}

interface NavItemConfig {
  id: string;
  icon: React.ElementType;
  label: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onChangeView }) => {
  const navItems: NavItemConfig[] = [
    { id: "home", icon: Home, label: "Home" },
    { id: "notes", icon: StickyNote, label: "Notes" },
    { id: "downloads", icon: Download, label: "Saved" },
  ];

  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div
        className="h-24 w-full opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Navigation Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
        {/* Shadcn Separator for the top border */}
        <Separator className="bg-emerald-100/60" />

        {/* Glassmorphism Background Layer */}
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_-10px_rgba(16,185,129,0.1)]">
          <div className="relative max-w-md mx-auto px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
            {/* Using Shadcn ToggleGroup to handle navigation state.
              This replaces manual button mapping with the UI library's native selection logic.
            */}
            <ToggleGroup
              type="single"
              value={activeView}
              onValueChange={(value) => {
                // Prevent unselecting the current tab
                if (value) onChangeView(value);
              }}
              className="justify-between gap-2 w-full"
            >
              {navItems.map((item) => {
                const isActive = activeView === item.id;
                const Icon = item.icon;

                return (
                  <ToggleGroupItem
                    key={item.id}
                    value={item.id}
                    aria-label={item.label}
                    className={cn(
                      // Base Layout
                      "group flex flex-1 flex-col items-center justify-center gap-1.5 h-auto py-3 rounded-xl transition-all duration-300",

                      // Inactive State
                      "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50 data-[state=off]:hover:scale-[1.02]",

                      // Active State (data-[state=on] is the Shadcn/Radix selector)
                      "data-[state=on]:bg-emerald-50 data-[state=on]:text-emerald-700",
                      "data-[state=on]:shadow-sm data-[state=on]:shadow-emerald-100/50 data-[state=on]:border-emerald-100/50"
                    )}
                  >
                    {/* Icon with animation on active state */}
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={cn(
                        "transition-all duration-300",
                        isActive
                          ? "text-emerald-600 scale-105 drop-shadow-sm"
                          : "text-slate-400 group-hover:text-emerald-500"
                      )}
                    />

                    {/* Label Text */}
                    <span
                      className={cn(
                        "text-[10px] font-medium tracking-wide leading-none transition-all duration-200",
                        isActive
                          ? "font-semibold text-emerald-800"
                          : "text-slate-500"
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <span className="absolute top-2 right-[20%] h-1.5 w-1.5 rounded-full bg-emerald-500 animate-in zoom-in duration-300" />
                    )}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
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
        className="h-28 w-full opacity-0 pointer-events-none lg:hidden"
        aria-hidden="true"
      />

      {/* Main Navigation Container - Hidden on desktop */}
      <div className="fixed bottom-0 left-0 right-0 z-50 w-full lg:hidden">
        {/* Enhanced Separator with gradient */}
        <Separator className="bg-linear-to-r from-transparent via-emerald-200/40 to-transparent h-px" />

        {/* Enhanced Glassmorphism Background */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-sm shadow-emerald-100/30">
          <div className="relative max-w-md mx-auto px-6 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            {/* Decorative Islamic geometric pattern element */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent rounded-full opacity-60" />

            <ToggleGroup
              type="single"
              value={activeView}
              onValueChange={(value) => {
                if (value) onChangeView(value);
              }}
              className="justify-between gap-3 w-full"
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
                      // Base Layout with enhanced spacing
                      "group relative flex flex-1 flex-col items-center justify-center gap-2 h-auto py-4 rounded-2xl transition-all duration-300 ease-out",

                      // Enhanced hover and active states
                      "hover:scale-[1.02] active:scale-[0.98] transform-gpu",

                      // Inactive State with subtle depth
                      "text-slate-600 hover:text-emerald-700 hover:bg-white/80",
                      "border border-transparent hover:border-emerald-200/60",
                      "shadow-sm hover:shadow-md hover:shadow-emerald-100/40",

                      // Active State with Islamic aesthetic colors
                      "data-[state=on]:bg-white data-[state=on]:text-emerald-700",
                      "data-[state=on]:border-emerald-200 data-[state=on]:shadow-lg",
                      "data-[state=on]:shadow-emerald-100/60 data-[state=on]:ring-2",
                      "data-[state=on]:ring-emerald-100 data-[state=on]:ring-offset-2",
                      "data-[state=on]:ring-offset-white"
                    )}
                  >
                    {/* Active state background glow */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-50/80 to-white/80 -z-10" />
                    )}

                    {/* Icon Container with enhanced styling */}
                    <div
                      className={cn(
                        "relative p-2 rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-emerald-100/80 shadow-inner shadow-emerald-200/30"
                          : "bg-slate-50/50 group-hover:bg-emerald-50/60"
                      )}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          "transition-all duration-300",
                          isActive
                            ? "text-emerald-600 scale-110 drop-shadow-sm"
                            : "text-slate-500 group-hover:text-emerald-500 group-hover:scale-105"
                        )}
                      />

                      {/* Subtle decorative dot for Islamic aesthetic */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
                      )}
                    </div>

                    {/* Label Text with improved typography */}
                    <span
                      className={cn(
                        "text-xs font-medium tracking-wide leading-tight transition-all duration-200 font-sans",
                        isActive
                          ? "font-semibold text-emerald-800 drop-shadow-sm"
                          : "text-slate-600 group-hover:text-emerald-700"
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Enhanced Active Indicator with Islamic geometric inspiration */}
                    {isActive && (
                      <div className="absolute -bottom-1 w-6 h-1 bg-linear-to-r from-emerald-400 to-emerald-500 rounded-full shadow-sm shadow-emerald-300/50 animate-in slide-in-from-bottom-1 duration-500" />
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
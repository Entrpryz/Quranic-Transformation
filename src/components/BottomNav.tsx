/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from "react";
import { Home, StickyNote, Download } from "lucide-react";

interface BottomNavProps {
  activeView: string;
  onChangeView: (view: any) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onChangeView }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "notes", icon: StickyNote, label: "Notes" },
    { id: "downloads", icon: Download, label: "Saved" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-emerald-200 pt-2 pb-safe">
      <div className="flex items-center justify-around px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 flex-1 max-w-[100px] ${
                isActive
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <div
                className={`p-2 rounded-lg transition-all ${
                  isActive ? "bg-emerald-100" : "bg-transparent"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-emerald-600" : "text-slate-500"}
                />
              </div>
              <span
                className={`text-xs font-semibold transition-all ${
                  isActive ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-1 h-1 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
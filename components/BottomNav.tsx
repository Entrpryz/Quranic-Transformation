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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto">
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xl border-2 border-emerald-200 shadow-2xl shadow-emerald-900/20 rounded-2xl px-4 py-3">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`relative flex items-center justify-center gap-3 min-h-[60px] min-w-[100px] px-4 rounded-xl transition-all duration-300 border-2 ${
                isActive
                  ? "bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 scale-105 border-emerald-900"
                  : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 border-transparent hover:border-emerald-300 focus:ring-4 focus:ring-emerald-500/30"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-base font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
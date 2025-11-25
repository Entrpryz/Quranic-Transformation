/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  Home,
  StickyNote,
  Download,
  Info,
  X,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { CATEGORIES, getCategoryTheme } from "@/lib/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onChangeView: (view: any) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
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
  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-r border-emerald-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 pb-6 pt-16 border-b border-emerald-200">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-lg border border-white/20 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-white/50"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center border border-white/20 text-white font-bold">
              QT
            </div>
            <div>
              <h2 className="font-bold text-xl text-white leading-tight">
                Student
              </h2>
              <p className="text-emerald-100 text-sm font-medium">
                Quranic Transform
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-8">
            <div className="px-2 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3">
              Library
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onChangeView("home");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                  activeView === "home"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg border-transparent"
                    : "text-emerald-700 hover:text-emerald-800 bg-white border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home size={20} strokeWidth={2.5} />
                  <span className="font-semibold text-base">Syllabus</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeView("notes");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                  activeView === "notes"
                    ? "bg-amber-500/20 text-amber-700 font-semibold border-amber-500/30"
                    : "text-emerald-700 hover:text-emerald-800 bg-white border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <StickyNote
                    size={20}
                    strokeWidth={2.5}
                    className={activeView === "notes" ? "text-amber-600" : ""}
                  />
                  <span className="font-semibold text-base">My Notes</span>
                </div>
                {savedNotesCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-700 px-2 py-1 rounded text-sm font-bold min-w-[24px] text-center border border-amber-500/30">
                    {savedNotesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onChangeView("downloads");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                  activeView === "downloads"
                    ? "bg-emerald-500/20 text-emerald-700 font-semibold border-emerald-500/30"
                    : "text-emerald-700 hover:text-emerald-800 bg-white border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Download
                    size={20}
                    strokeWidth={2.5}
                    className={
                      activeView === "downloads" ? "text-emerald-600" : ""
                    }
                  />
                  <span className="font-semibold text-base">Offline</span>
                </div>
                {downloadsCount > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-700 px-2 py-1 rounded text-sm font-bold min-w-[24px] text-center border border-emerald-500/30">
                    {downloadsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="px-2 flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Modules
              </span>
              <LayoutGrid size={16} className="text-emerald-600" />
            </div>

            <div className="space-y-2">
              {CATEGORIES.map((category) => {
                const theme = getCategoryTheme(category);
                const isActive =
                  activeCategory === category && activeView === "home";

                if (category === "All") return null;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      onSelectCategory(category);
                      onChangeView("home");
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm border group ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-800 border-emerald-500/30"
                        : "text-emerald-700 hover:text-emerald-800 bg-white border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full transition-all border ${
                          isActive
                            ? theme.accent +
                              " ring-2 ring-offset-2 ring-emerald-500/20 border-white"
                            : "bg-emerald-500/30 border-emerald-400"
                        }`}
                      ></div>
                      <span
                        className={`font-medium ${
                          isActive ? "font-semibold" : ""
                        }`}
                      >
                        {category}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight size={16} className="text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-emerald-200 bg-emerald-50 shrink-0">
          <div className="flex items-center gap-2 text-emerald-700 text-base mb-1 font-semibold">
            <Info size={16} />
            <span>About</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium">
            Quranic Transform v3.0 • Mobile Edition
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

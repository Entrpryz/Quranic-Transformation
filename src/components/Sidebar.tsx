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
  BookOpen,
  GraduationCap,
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white/95 backdrop-blur-xl z-50 shadow-xl shadow-emerald-100/50 transform transition-all duration-300 ease-out flex flex-col border-r border-slate-200/80 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 p-6 pb-6 pt-16 border-b border-emerald-200/50 relative overflow-hidden">
          {/* Decorative Islamic Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDBDOC45NTQgMCAwIDguOTU0IDAgMjBDMCAzMS4wNDYgOC45NTQgNDAgMjAgNDBDMzEuMDQ2IDQwIDQwIDMxLjA0NiA0MCAyMEM0MCA4Ljk1NCAzMS4wNDYgMCAyMCAwWk0yMCAzNkMxMC4wNTkgMzYgMiAyNy45NDEgMiAxOEMyIDguMDU5IDEwLjA1OSAwIDIwIDBDMjkuOTQxIDAgMzggOC4wNTkgMzggMThDMzggMjcuOTQxIDI5Ljk0MSAzNiAyMCAzNloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNiAxNEMyNiAxNi4yMDkxIDI0LjIwOTEgMTggMjIgMThDMjEuNDQ3NyAxOCAyMC45MTUgMTcuODIyOCAyMC40NzM0IDE3LjUwMjZMMjIuOTMzOSAxNS4wNDIxQzI0LjE0NzIgMTQuOTU3OSAyNS4xNDc4IDE0LjM1MjIgMjUuNzA3MSAxMy40NjQxQzI1Ljg5NzEgMTMuODE0OSAyNiAxNC4xOTc1IDI2IDE0LjVWMTRaTTE0IDE0QzE0IDExLjc5MDkgMTUuNzkwOSAxMCAxOCAxMEMxOC41NTIzIDEwIDE5LjA4NSAxMC4xNzcyIDE5LjUyNjYgMTAuNDk3NEwxNy4wNjYxIDEyLjk1NzlDMTUuODUyOCAxMy4wNDIxIDE0Ljg1MjIgMTMuNjQ3OCAxNC4yOTI5IDE0LjUzNTlDMTQuMTAyOSAxNC4xODUxIDE0IDE0LjAwMjUgMTQgMTMuNVYxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=')]"></div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/90 hover:bg-white/20 rounded-xl border border-white/30 shadow-sm transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-emerald-600"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30 text-white font-bold shadow-lg backdrop-blur-sm">
              <BookOpen size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-2xl text-white leading-tight font-sans">
                Quranic Journey
              </h2>
              <p className="text-emerald-100/90 text-sm font-medium font-sans tracking-wide">
                Transformative Learning
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 px-5 bg-slate-50/50">
          {/* Library Section */}
          <div className="mb-8">
            <div className="px-3 text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 font-sans bg-white/50 py-1.5 rounded-lg inline-block border border-emerald-100">
              Library
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  onChangeView("home");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 hover:scale-[1.02] hover:shadow-md ${
                  activeView === "home"
                    ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg border-transparent shadow-emerald-200"
                    : "text-emerald-800 hover:text-emerald-900 bg-white/80 border-slate-200 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-xl ${
                      activeView === "home"
                        ? "bg-white/20"
                        : "bg-emerald-50 border border-emerald-100"
                    }`}
                  >
                    <Home
                      size={20}
                      strokeWidth={2.5}
                      className={
                        activeView === "home"
                          ? "text-white"
                          : "text-emerald-600"
                      }
                    />
                  </div>
                  <span className="font-semibold text-base font-sans">
                    Syllabus
                  </span>
                </div>
                {activeView === "home" && (
                  <ChevronRight size={18} className="text-white/90" />
                )}
              </button>

              <button
                onClick={() => {
                  onChangeView("notes");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 hover:scale-[1.02] hover:shadow-md ${
                  activeView === "notes"
                    ? "bg-amber-500/15 text-amber-800 font-semibold border-amber-300 shadow-md shadow-amber-100"
                    : "text-emerald-800 hover:text-emerald-900 bg-white/80 border-slate-200 hover:border-amber-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-xl ${
                      activeView === "notes"
                        ? "bg-amber-500/20 border border-amber-400/30"
                        : "bg-amber-50 border border-amber-100"
                    }`}
                  >
                    <StickyNote
                      size={20}
                      strokeWidth={2.5}
                      className={
                        activeView === "notes"
                          ? "text-amber-600"
                          : "text-amber-500"
                      }
                    />
                  </div>
                  <span className="font-semibold text-base font-sans">
                    My Notes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {savedNotesCount > 0 && (
                    <span className="bg-amber-500/20 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold min-w-[28px] text-center border border-amber-400/30 shadow-sm">
                      {savedNotesCount}
                    </span>
                  )}
                  {activeView === "notes" && (
                    <ChevronRight size={18} className="text-amber-600" />
                  )}
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeView("downloads");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 hover:scale-[1.02] hover:shadow-md ${
                  activeView === "downloads"
                    ? "bg-emerald-500/15 text-emerald-800 font-semibold border-emerald-300 shadow-md shadow-emerald-100"
                    : "text-emerald-800 hover:text-emerald-900 bg-white/80 border-slate-200 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-xl ${
                      activeView === "downloads"
                        ? "bg-emerald-500/20 border border-emerald-400/30"
                        : "bg-emerald-50 border border-emerald-100"
                    }`}
                  >
                    <Download
                      size={20}
                      strokeWidth={2.5}
                      className={
                        activeView === "downloads"
                          ? "text-emerald-600"
                          : "text-emerald-500"
                      }
                    />
                  </div>
                  <span className="font-semibold text-base font-sans">
                    Offline
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {downloadsCount > 0 && (
                    <span className="bg-emerald-500/20 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold min-w-[28px] text-center border border-emerald-400/30 shadow-sm">
                      {downloadsCount}
                    </span>
                  )}
                  {activeView === "downloads" && (
                    <ChevronRight size={18} className="text-emerald-600" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Modules Section */}
          <div>
            <div className="px-3 flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest font-sans bg-white/50 py-1.5 rounded-lg inline-block px-4 border border-emerald-100">
                Modules
              </span>
              <div className="p-2 bg-white/80 rounded-xl border border-slate-200">
                <GraduationCap size={16} className="text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2.5">
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
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 text-sm border-2 group hover:scale-[1.02] ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-800 border-emerald-300 shadow-sm shadow-emerald-100"
                        : "text-emerald-700 hover:text-emerald-800 bg-white/80 border-slate-200 hover:border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                          isActive
                            ? `${theme.accent} ring-2 ring-offset-2 ring-emerald-500/30 border-white shadow-sm`
                            : "bg-emerald-400/40 border-emerald-300 group-hover:bg-emerald-400/60"
                        }`}
                      ></div>
                      <span
                        className={`font-medium font-sans ${
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

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/80 bg-linear-to-r from-emerald-50 to-teal-50/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 text-emerald-800 text-base mb-2 font-semibold font-sans">
            <div className="p-1.5 bg-white/80 rounded-lg border border-emerald-100">
              <Info size={16} className="text-emerald-600" />
            </div>
            <span>About</span>
          </div>
          <p className="text-sm text-emerald-700/80 font-medium font-sans pl-9">
            Quranic Transform v3.0 • Mobile Edition
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
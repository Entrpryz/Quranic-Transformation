import React from "react";
import {
  Home,
  StickyNote,
  Download,
  Info,
  X,
  User,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { CATEGORIES, getCategoryTheme } from "../constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  onChangeView: (view: string) => void;
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
        className={`fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col border-2 border-emerald-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Profile / Header Section */}
        <div className="bg-slate-100 p-8 pb-8 pt-16 border-b-2 border-slate-200">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 text-slate-500 hover:text-slate-800 bg-white border-2 border-slate-300 rounded-full shadow-sm transition-colors focus:ring-4 focus:ring-emerald-500/30"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 border-2 border-white">
              <User size={32} />
            </div>
            <div>
              <h2 className="font-bold text-2xl text-slate-800 leading-tight">
                Student
              </h2>
              <p className="text-slate-600 text-base font-semibold">
                Qur'anic Transform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-8 px-6">
          <div className="mb-10">
            <div className="px-3 text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Library
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onChangeView("home");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                  activeView === "home"
                    ? "bg-slate-900 text-white shadow-lg border-slate-900"
                    : "text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Home size={24} strokeWidth={2.5} />
                  <span className="font-bold text-lg">Syllabus</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onChangeView("notes");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                  activeView === "notes"
                    ? "bg-amber-100 text-amber-900 font-bold border-amber-300"
                    : "text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <StickyNote
                    size={24}
                    strokeWidth={2.5}
                    className={activeView === "notes" ? "text-amber-700" : ""}
                  />
                  <span className="font-bold text-lg">My Notes</span>
                </div>
                {savedNotesCount > 0 && (
                  <span className="bg-amber-200 text-amber-800 px-3 py-1 rounded-lg text-base font-bold min-w-[28px] text-center border-2 border-amber-300">
                    {savedNotesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onChangeView("downloads");
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                  activeView === "downloads"
                    ? "bg-blue-100 text-blue-900 font-bold border-blue-300"
                    : "text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Download
                    size={24}
                    strokeWidth={2.5}
                    className={
                      activeView === "downloads" ? "text-blue-700" : ""
                    }
                  />
                  <span className="font-bold text-lg">Offline</span>
                </div>
                {downloadsCount > 0 && (
                  <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-base font-bold min-w-[28px] text-center border-2 border-blue-300">
                    {downloadsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="px-3 flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Modules
              </span>
              <LayoutGrid size={18} className="text-slate-400" />
            </div>

            <div className="space-y-2">
              {CATEGORIES.map((category) => {
                const theme = getCategoryTheme(category);
                const isActive =
                  activeCategory === category && activeView === "home";

                return (
                  <button
                    key={category}
                    onClick={() => {
                      onSelectCategory(category);
                      onChangeView("home");
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-base border-2 group ${
                      isActive
                        ? "bg-slate-100 text-slate-900 border-slate-300"
                        : "text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-300 focus:ring-4 focus:ring-emerald-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full transition-all border-2 ${
                          isActive
                            ? theme.accent +
                              " ring-2 ring-offset-2 ring-slate-200 border-white"
                            : "bg-slate-300 border-slate-400 group-hover:bg-slate-400"
                        }`}
                      ></div>
                      <span
                        className={`font-semibold ${
                          isActive ? "font-bold" : ""
                        }`}
                      >
                        {category}
                      </span>
                    </div>
                    {isActive && (
                      <ChevronRight size={18} className="text-slate-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t-2 border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3 text-slate-500 text-lg mb-2 font-semibold">
            <Info size={20} />
            <span>About</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Qur'anic Transform v2.2 • Mobile Edition
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
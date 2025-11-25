/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Menu, Sparkles, FileText } from "lucide-react";
import {
  SYLLABUS_DATA,
  CATEGORIES,
  Note,
  Lesson,
  getCategoryTheme,
} from "@/lib/constants";

// Component Imports
import BottomNav from "@/components/BottomNav";
import LessonCard from "@/components/LessonCard";
import LessonDetail from "@/components/LessonDetail";
import NoteEditor from "@/components/NoteEditor";
import Sidebar from "@/components/Sidebar";
import PdfViewer from "@/components/PdfViewer";

export default function Home() {
  // --- State Management ---
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- "Return to Topic" Logic ---
  // We track the 'active' lesson in the modal.
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // These states layer ON TOP of the selectedLesson, preserving the "parent" view.
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isViewingPdf, setIsViewingPdf] = useState(false);

  // --- Persistence Logic ---
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("qt_notes_v3");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      const savedDownloads = localStorage.getItem("qt_downloads");
      if (savedDownloads) setDownloadedIds(new Set(JSON.parse(savedDownloads)));
    } catch (e) {
      console.error("Failed to load saved data:", e);
    }
  }, []);

  const handleSaveNote = (
    lessonId: number,
    content: string,
    isUrdu: boolean
  ) => {
    const updatedNotes = {
      ...notes,
      [lessonId]: { content, isUrdu, lastModified: new Date().toISOString() },
    };
    setNotes(updatedNotes);
    localStorage.setItem("qt_notes_v3", JSON.stringify(updatedNotes));
  };

  const handleDownload = (lessonId: number) => {
    const newSet = new Set(downloadedIds);
    newSet.add(lessonId);
    setDownloadedIds(newSet);
    localStorage.setItem("qt_downloads", JSON.stringify(Array.from(newSet)));
  };

  // --- Search & Filter Logic ---
  const filteredData = useMemo(() => {
    let data = SYLLABUS_DATA;

    if (view === "notes")
      data = data.filter(
        (l) => notes[l.id] && notes[l.id].content.trim().length > 0
      );
    else if (view === "downloads")
      data = data.filter((l) => downloadedIds.has(l.id));

    if (view === "home" && filterCategory !== "All")
      data = data.filter((l) => l.part === filterCategory);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (l) =>
          l.topicName.toLowerCase().includes(lower) ||
          l.description.toLowerCase().includes(lower) ||
          l.detailedDescription.toLowerCase().includes(lower) ||
          l.surahReference.toLowerCase().includes(lower) ||
          l.surahName.toLowerCase().includes(lower) ||
          l.tags.some((tag) => tag.toLowerCase().includes(lower))
      );
    }
    return data;
  }, [view, filterCategory, searchTerm, notes, downloadedIds]);

  const savedNotesCount = Object.values(notes).filter(
    (n) => n.content.trim().length > 0
  ).length;
  const downloadsCount = downloadedIds.size;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50 pb-20">
      {/* --- HEADER SECTION (Fixed/Sticky) --- */}
      <div className="sticky top-0 z-40 bg-linear-to-r from-emerald-600 to-teal-700 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white/20 rounded-xl text-white hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 p-1 border border-white/20 flex items-center justify-center font-bold text-white">
                QT
              </div>
              <div className="text-right">
                <div className="text-white/80 text-xs font-medium">
                  Welcome to
                </div>
                <div className="text-white font-bold text-sm">
                  Quranic Transform
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-3.5 text-emerald-600"
              size={18}
            />
            <input
              type="text"
              placeholder={
                view === "notes"
                  ? "Search your reflections..."
                  : "Search topics, surahs..."
              }
              className="w-full bg-white/95 border border-emerald-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-emerald-600/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT LIST --- */}
      <main className="px-4 pt-4 relative z-10">
        {/* Banner (Only on Home) */}
        {view === "home" && !searchTerm && (
          <div className="mb-6 p-6 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-800 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} /> v3.0
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight mb-1">
              Quranic Transformation
            </h1>
            <p className="text-emerald-100 text-sm opacity-90">
              Journey through divine wisdom
            </p>
          </div>
        )}

        {/* Categories (Home only) */}
        {view === "home" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
            {CATEGORIES.map((cat) => {
              const theme = getCategoryTheme(cat);
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                    isActive
                      ? `${theme.accent} text-white border-emerald-600 shadow-md`
                      : "bg-white text-emerald-700 border-emerald-200"
                  }`}
                >
                  {cat === "All" ? "All Topics" : cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-emerald-400 border border-emerald-200 shadow-sm">
              {view === "notes" ? <FileText size={24} /> : <Search size={24} />}
            </div>
            <p className="font-bold text-lg text-slate-800 mb-2">
              {searchTerm ? "No results found" : "Nothing here yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pb-safe">
            {filteredData.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                hasNote={!!notes[lesson.id]?.content}
                isDownloaded={downloadedIds.has(lesson.id)}
                onClick={() => setSelectedLesson(lesson)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav
        activeView={view}
        onChangeView={(v) => {
          setView(v);
          setFilterCategory("All");
          setSearchTerm("");
          window.scrollTo(0, 0);
        }}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={view}
        onChangeView={setView}
        activeCategory={filterCategory}
        onSelectCategory={setFilterCategory}
        savedNotesCount={savedNotesCount}
        downloadsCount={downloadsCount}
      />

      {/* --- MODALS (Stacked to preserve state) --- */}

      {/* 1. Detail Modal */}
      {selectedLesson && !isEditingNote && !isViewingPdf && (
        <LessonDetail
          lesson={selectedLesson}
          hasNote={!!notes[selectedLesson.id]?.content}
          isDownloaded={downloadedIds.has(selectedLesson.id)}
          onClose={() => setSelectedLesson(null)}
          onOpenNote={() => setIsEditingNote(true)}
          onOpenPdf={() => setIsViewingPdf(true)}
          onDownload={() => handleDownload(selectedLesson.id)}
        />
      )}

      {/* 2. Note Editor (Overlays Detail) */}
      {selectedLesson && isEditingNote && (
        <NoteEditor
          lesson={selectedLesson}
          initialContent={notes[selectedLesson.id]?.content || ""}
          initialIsUrdu={notes[selectedLesson.id]?.isUrdu || false}
          onClose={() => setIsEditingNote(false)} // Returns to Detail View
          onSave={(content, isUrdu) =>
            handleSaveNote(selectedLesson.id, content, isUrdu)
          }
        />
      )}

      {/* 3. PDF Viewer Overlay (Overlays Detail) */}
      {selectedLesson && isViewingPdf && (
        <PdfViewer
          lesson={selectedLesson}
          onClose={() => setIsViewingPdf(false)} // Returns to Detail View
        />
      )}
    </div>
  );
}
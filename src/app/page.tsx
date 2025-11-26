/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Menu, Search, Filter, BookOpen } from "lucide-react";
import { SYLLABUS_DATA, CATEGORIES, Note, Lesson } from "@/lib/constants";

// Components
import LessonCard from "@/components/LessonCard";
import LessonDetail from "@/components/LessonDetail";
import NoteEditor from "@/components/NoteEditor";
import Sidebar from "@/components/Sidebar";
import PdfViewer from "@/components/PdfViewer";
import BottomNav from "@/components/BottomNav";

// UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  // --- Core State ---
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // --- Data State ---
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [isClient, setIsClient] = useState(false);

  // --- UI State ---
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isViewingPdf, setIsViewingPdf] = useState(false);

  // --- Persistence & Initialization ---
  useEffect(() => {
    setIsClient(true);
    try {
      const savedNotes = localStorage.getItem("qt_notes_v3");
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      const savedDownloads = localStorage.getItem("qt_downloads");
      if (savedDownloads) setDownloadedIds(new Set(JSON.parse(savedDownloads)));
    } catch (e) {
      console.error("Data load error:", e);
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

  const handleDownloadStatusUpdate = (lessonId: number) => {
    const newSet = new Set(downloadedIds);
    newSet.add(lessonId);
    setDownloadedIds(newSet);
    localStorage.setItem("qt_downloads", JSON.stringify(Array.from(newSet)));
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let data = SYLLABUS_DATA;

    // View Filtering
    if (view === "notes") {
      data = data.filter((l) => notes[l.id]?.content?.trim().length > 0);
    } else if (view === "downloads") {
      data = data.filter((l) => downloadedIds.has(l.id));
    }

    // Category Filtering (Only applies on Home view usually, but good to have)
    if (view === "home" && filterCategory !== "All") {
      data = data.filter((l) => l.part === filterCategory);
    }

    // Search Filtering
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (l) =>
          l.topicName.toLowerCase().includes(lower) ||
          l.surahName.toLowerCase().includes(lower) ||
          l.urduTitle.includes(searchTerm) // Allow Urdu search
      );
    }
    return data;
  }, [view, filterCategory, searchTerm, notes, downloadedIds]);

  const savedNotesCount = Object.values(notes).filter(
    (n) => n.content.trim().length > 0
  ).length;

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <>
      {/* 1. Sidebar */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeView={view}
        onChangeView={(v) => {
          setView(v);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        activeCategory={filterCategory}
        onSelectCategory={setFilterCategory}
        savedNotesCount={savedNotesCount}
        downloadsCount={downloadedIds.size}
      />

      {/* 2. Main Layout */}
      <main className="flex-1 min-h-screen bg-background relative w-full lg:ml-0 transition-all duration-300">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 md:px-8 md:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-zinc-400 hover:text-white -ml-2"
              >
                <Menu />
              </Button>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {view === "home" && (
                  <BookOpen className="w-5 h-5 text-emerald-500" />
                )}
                {view === "home"
                  ? "Syllabus"
                  : view === "notes"
                  ? "My Reflections"
                  : "Offline Library"}
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-sm md:max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="pl-9 h-9 md:h-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500 rounded-lg transition-all"
              />
            </div>
          </div>

          {/* Mobile Category Pills */}
          {view === "home" && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden mask-fade-right">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterCategory === cat
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                  }`}
                >
                  {cat === "All" ? "All Modules" : cat}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-12">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 opacity-40" />
              </div>
              <p className="text-lg font-medium">No lessons found</p>
              <p className="text-sm opacity-60">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
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
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav activeView={view} onChangeView={setView} />

      {/* --- Modals --- */}

      {/* Lesson Detail Overlay */}
      {selectedLesson && !isEditingNote && !isViewingPdf && (
        <LessonDetail
          lesson={selectedLesson}
          hasNote={!!notes[selectedLesson.id]?.content}
          isDownloaded={downloadedIds.has(selectedLesson.id)}
          onClose={() => setSelectedLesson(null)}
          onOpenNote={() => setIsEditingNote(true)}
          onOpenPdf={() => setIsViewingPdf(true)}
          onDownload={() => handleDownloadStatusUpdate(selectedLesson.id)}
        />
      )}

      {/* Fullscreen Note Editor */}
      {selectedLesson && isEditingNote && (
        <NoteEditor
          lesson={selectedLesson}
          initialContent={notes[selectedLesson.id]?.content || ""}
          initialIsUrdu={notes[selectedLesson.id]?.isUrdu || false}
          onClose={() => setIsEditingNote(false)}
          onSave={(content, isUrdu) =>
            handleSaveNote(selectedLesson.id, content, isUrdu)
          }
        />
      )}

      {/* Fullscreen PDF Viewer */}
      {selectedLesson && isViewingPdf && (
        <PdfViewer
          lesson={selectedLesson}
          onClose={() => setIsViewingPdf(false)}
        />
      )}
    </>
  );
}
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Menu, Search, Filter } from "lucide-react";
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
  // --- State ---
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  // Sidebar State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isViewingPdf, setIsViewingPdf] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("qt_notes_v3");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      const savedDownloads = localStorage.getItem("qt_downloads");
      if (savedDownloads) setDownloadedIds(new Set(JSON.parse(savedDownloads)));
    } catch (e) {
      console.error("Failed to load data:", e);
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

  // --- Filtering ---
  const filteredData = useMemo(() => {
    let data = SYLLABUS_DATA;
    if (view === "notes")
      data = data.filter((l) => notes[l.id]?.content?.trim().length > 0);
    else if (view === "downloads")
      data = data.filter((l) => downloadedIds.has(l.id));

    if (view === "home" && filterCategory !== "All")
      data = data.filter((l) => l.part === filterCategory);

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (l) =>
          l.topicName.toLowerCase().includes(lower) ||
          l.surahName.toLowerCase().includes(lower) ||
          l.description.toLowerCase().includes(lower)
      );
    }
    return data;
  }, [view, filterCategory, searchTerm, notes, downloadedIds]);

  const savedNotesCount = Object.values(notes).filter(
    (n) => n.content.trim().length > 0
  ).length;

  return (
    <>
      {/* 1. Sidebar (Responsive) */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeView={view}
        onChangeView={setView}
        activeCategory={filterCategory}
        onSelectCategory={setFilterCategory}
        savedNotesCount={savedNotesCount}
        downloadsCount={downloadedIds.size}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-background relative w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-zinc-400 hover:text-white"
              >
                <Menu />
              </Button>
              <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">
                {view === "home"
                  ? "Syllabus"
                  : view === "notes"
                  ? "My Reflections"
                  : "Downloads"}
              </h1>
            </div>

            {/* High Contrast Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search topics, surahs..."
                className="pl-9 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:ring-1 focus:ring-emerald-500 rounded-full transition-all"
              />
            </div>
          </div>

          {/* Mobile Category Pills (Horizontal Scroll) - Only on Home */}
          {view === "home" && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar md:hidden">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filterCategory === cat
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400"
                  }`}
                >
                  {cat === "All" ? "All" : cat}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 pb-24 md:pb-8">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Filter className="h-12 w-12 mb-4 opacity-20" />
              <p>No lessons found.</p>
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

      {/* --- Modals & Overlays --- */}

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

      {/* 2. Note Editor */}
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

      {/* 3. PDF Viewer (Rebuilt) */}
      {selectedLesson && isViewingPdf && (
        <PdfViewer
          lesson={selectedLesson}
          onClose={() => setIsViewingPdf(false)}
        />
      )}
    </>
  );
}

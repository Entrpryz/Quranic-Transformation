/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Menu, Search, BookOpen, Sparkles, Inbox, Loader2 } from "lucide-react";
import { CATEGORIES, Lesson } from "@/lib/constants";

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Note {
  content: string;
  isUrdu: boolean;
  lastModified: string;
}

export default function Dashboard() {
  // --- Core State ---
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // --- Data State ---
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  // --- UI State ---
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isViewingPdf, setIsViewingPdf] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Parallel data fetching for performance
      const [lessonsRes, reflectionsRes, bookmarksRes] = await Promise.all([
        fetch("/api/lessons"),
        fetch("/api/reflections"),
        fetch("/api/bookmarks"),
      ]);

      const lessonsData = await lessonsRes.json();
      setLessons(lessonsData);

      const reflectionsData = await reflectionsRes.json();
      const notesMap: Record<number, Note> = {};
      reflectionsData.forEach((r: any) => {
        notesMap[r.lessonId] = {
          content: r.content,
          isUrdu: r.isUrdu,
          lastModified: r.updatedAt,
        };
      });
      setNotes(notesMap);

      const bookmarksData = await bookmarksRes.json();
      const bIds = new Set<number>(bookmarksData.map((b: any) => b.lessonId));
      setDownloadedIds(bIds);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNote = async (
    lessonId: number,
    content: string,
    isUrdu: boolean
  ) => {
    const updatedNotes = {
      ...notes,
      [lessonId]: { content, isUrdu, lastModified: new Date().toISOString() },
    };
    setNotes(updatedNotes);

    try {
      await fetch("/api/reflections", {
        method: "POST",
        body: JSON.stringify({ lessonId, content, isUrdu }),
        headers: { "Content-Type": "application/json" },
      });
      // In a real app, we might re-fetch or rely on optimistic UI logic
    } catch (e) {
      console.error("Save note failed", e);
    }
  };

  const handleDownloadStatusUpdate = async (lessonId: number) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        body: JSON.stringify({ lessonId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      const newSet = new Set(downloadedIds);
      if (data.bookmarked) {
        newSet.add(lessonId);
      } else {
        newSet.delete(lessonId);
      }
      setDownloadedIds(newSet);
    } catch (e) {
      console.error("Bookmark toggle failed", e);
    }
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let data = lessons;

    // View Filtering
    if (view === "notes") {
      data = data.filter((l) => notes[l.id]?.content?.trim().length > 0);
    } else if (view === "downloads") {
      data = data.filter((l) => downloadedIds.has(l.id));
    }

    // Category Filtering
    if (view === "home" && filterCategory !== "All") {
      data = data.filter((l) => l.part === filterCategory);
    }

    // Search Filtering
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (l: any) =>
          (l.title && l.title.toLowerCase().includes(lower)) ||
          (l.surahReference &&
            l.surahReference.toLowerCase().includes(lower)) ||
          (l.urduTitle && l.urduTitle.includes(searchTerm))
      );
    }
    return data;
  }, [view, filterCategory, searchTerm, notes, downloadedIds, lessons]);

  const savedNotesCount = Object.values(notes).filter(
    (n) => n.content.trim().length > 0
  ).length;

  // --- Render Helpers ---

  // Adapts API lesson shape to UI component shape
  const mapToUiLesson = (lesson: any): Lesson => ({
    ...lesson,
    topicName: lesson.title,
    surahName: lesson.surahReference
      ? lesson.surahReference.replace(/Surah\s+| \(.*\)/g, "")
      : "",
    detailedDescription: lesson.detailedDescription || "",
    tags: [],
  });

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar Navigation */}
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

      {/* Main Content Area */}
      <main className="flex-1 relative w-full transition-all duration-300 min-h-screen flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl supports-backdrop-filter:bg-zinc-950/60">
          <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-[1600px] mx-auto">
            {/* Left: Title & Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-zinc-400 hover:text-white -ml-2"
              >
                <Menu className="h-6 w-6" />
              </Button>

              <div className="flex items-center gap-2">
                {view === "home" && (
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                )}
                {view === "notes" && (
                  <Sparkles className="h-5 w-5 text-amber-500" />
                )}
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100 hidden sm:block">
                  {view === "home"
                    ? "Syllabus"
                    : view === "notes"
                    ? "My Reflections"
                    : "Offline Library"}
                </h1>
              </div>
            </div>

            {/* Right: Search */}
            <div className="flex items-center gap-4 flex-1 justify-end max-w-md ml-auto">
              <div className="relative w-full max-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search lessons..."
                  className="pl-9 h-9 bg-zinc-900/50 border-zinc-800 text-sm placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sub-header: Categories (Mobile/Desktop Scroll) */}
          {view === "home" && (
            <div className="border-t border-zinc-800/50 bg-zinc-900/20">
              <div className="max-w-[1600px] mx-auto">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-2 p-4 md:px-8">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`
                            px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
                            ${
                              filterCategory === cat
                                ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                            }
                          `}
                      >
                        {cat === "All" ? "All Modules" : cat}
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
              </div>
            </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="flex-1 p-4 md:p-8 pb-32 md:pb-12 max-w-[1600px] mx-auto w-full">
          {isLoading ? (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-zinc-500">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
              <p className="animate-pulse text-sm">
                Loading your curriculum...
              </p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
                <Inbox className="h-10 w-10 text-zinc-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-zinc-200">
                  No lessons found
                </h3>
                <p className="text-zinc-500 max-w-xs mx-auto">
                  We couldn&apos;t find any lessons matching your current
                  filters. Try adjusting your search.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("All");
                }}
                className="mt-4 border-zinc-700 hover:bg-zinc-800 hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((lesson: any) => {
                const uiLesson = mapToUiLesson(lesson);
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={uiLesson}
                    hasNote={!!notes[lesson.id]?.content}
                    isDownloaded={downloadedIds.has(lesson.id)}
                    onClick={() => setSelectedLesson(uiLesson)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeView={view} onChangeView={setView} />

      {/* --- Modals & Overlays --- */}

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

      {selectedLesson && isViewingPdf && (
        <PdfViewer
          lesson={selectedLesson}
          onClose={() => setIsViewingPdf(false)}
        />
      )}
    </div>
  );
}

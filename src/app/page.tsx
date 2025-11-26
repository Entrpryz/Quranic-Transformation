/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Menu,
  Sparkles,
  FileText,
  BookOpen,
  Download,
  StickyNote,
} from "lucide-react";
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

// Shadcn UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  // --- State Management ---
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- "Return to Topic" Logic ---
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* --- HEADER SECTION (Modern Islamic Design) --- */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="h-10 w-10 rounded-xl border-slate-200 bg-white/80 hover:bg-white hover:scale-[1.02] transition-all duration-200"
            >
              <Menu className="h-4 w-4 text-emerald-700" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 p-1 flex items-center justify-center font-bold text-white shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="text-right">
                <div className="text-slate-600 text-xs font-medium">
                  Welcome to
                </div>
                <div className="text-emerald-700 font-bold text-sm leading-tight">
                  Quranic Transform
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-emerald-600"
              size={18}
            />
            <Input
              type="text"
              placeholder={
                view === "notes"
                  ? "Search your reflections..."
                  : "Search topics, surahs..."
              }
              className="w-full bg-white border-slate-200 rounded-xl pl-10 pr-4 py-2 text-slate-800 placeholder-emerald-600/70 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT LIST --- */}
      <main className="px-4 pt-4 relative z-10 max-w-md mx-auto">
        {/* Stats & View Toggle */}
        <div className="mb-4">
          <Tabs
            value={view}
            onValueChange={(v: any) => {
              setView(v);
              setFilterCategory("All");
              setSearchTerm("");
              window.scrollTo(0, 0);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 rounded-xl bg-slate-100/80 p-1">
              <TabsTrigger
                value="home"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Topics
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <StickyNote className="h-3 w-3 mr-1" />
                Notes {savedNotesCount > 0 && `(${savedNotesCount})`}
              </TabsTrigger>
              <TabsTrigger
                value="downloads"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Download className="h-3 w-3 mr-1" />
                Downloads {downloadsCount > 0 && `(${downloadsCount})`}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Banner (Only on Home) */}
        {view === "home" && !searchTerm && (
          <Card className="mb-6 border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-600 text-white text-xs px-2 py-0 rounded-full"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> v3.0
                </Badge>
              </div>
              <CardTitle className="text-xl text-emerald-800 leading-tight">
                Quranic Transformation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-700/80 text-sm leading-relaxed">
                Journey through divine wisdom with reflective insights and
                spiritual growth
              </p>
            </CardContent>
          </Card>
        )}

        {/* Categories (Home only) */}
        {view === "home" && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const theme = getCategoryTheme(cat);
              const isActive = filterCategory === cat;
              return (
                <Button
                  key={cat}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:scale-[1.02]"
                      : "bg-white text-emerald-700 border-slate-200 hover:bg-slate-50 hover:scale-[1.02]"
                  }`}
                >
                  {cat === "All" ? "All Topics" : cat}
                </Button>
              );
            })}
          </div>
        )}

        {/* Results */}
        {filteredData.length === 0 ? (
          <Card className="text-center py-16 border-slate-200 bg-white/90 shadow-sm">
            <CardContent>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center text-emerald-500 border border-slate-200">
                {view === "notes" ? (
                  <FileText size={24} />
                ) : (
                  <Search size={24} />
                )}
              </div>
              <p className="font-semibold text-lg text-slate-800 mb-2">
                {searchTerm ? "No results found" : "Nothing here yet"}
              </p>
              <p className="text-slate-600 text-sm">
                {view === "notes"
                  ? "Start taking notes on topics to see them here"
                  : view === "downloads"
                  ? "Download topics to access them offline"
                  : "Try searching for different terms"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 pb-safe">
            {filteredData.map((lesson) => (
              <div
                key={lesson.id}
                className="transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <LessonCard
                  lesson={lesson}
                  hasNote={!!notes[lesson.id]?.content}
                  isDownloaded={downloadedIds.has(lesson.id)}
                  onClick={() => setSelectedLesson(lesson)}
                />
              </div>
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
          onClose={() => setIsEditingNote(false)}
          onSave={(content, isUrdu) =>
            handleSaveNote(selectedLesson.id, content, isUrdu)
          }
        />
      )}

      {/* 3. PDF Viewer Overlay (Overlays Detail) */}
      {selectedLesson && isViewingPdf && (
        <PdfViewer
          lesson={selectedLesson}
          onClose={() => setIsViewingPdf(false)}
        />
      )}
    </div>
  );
}
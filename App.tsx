import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, FileText, X, Sparkles, Book } from "lucide-react";
import {
  SYLLABUS_DATA,
  CATEGORIES,
  Note,
  Lesson,
  getEmbedUrl,
  getDownloadUrl,
  getCategoryTheme,
} from "./constants";
import BottomNav from "./components/BottomNav";
import LessonCard from "./components/LessonCard";
import LessonDetail from "./components/LessonDetail";
import NoteEditor from "./components/NoteEditor";

const App = () => {
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  // Modals
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeNoteLesson, setActiveNoteLesson] = useState<Lesson | null>(null);
  const [activePdfLesson, setActivePdfLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("qt_notes_v3");
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      const savedDownloads = localStorage.getItem("qt_downloads");
      if (savedDownloads) setDownloadedIds(new Set(JSON.parse(savedDownloads)));
    } catch (e) {}
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
          l.title.toLowerCase().includes(lower) ||
          l.description.toLowerCase().includes(lower)
      );
    }
    return data;
  }, [view, filterCategory, searchTerm, notes, downloadedIds]);

  return (
    <div className="min-h-screen pb-32 bg-slate-50">
      {/* Hero Header */}
      <div className="bg-[#064E3B] text-white pt-safe pb-8 rounded-b-[2.5rem] shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="px-6 relative z-10 pt-4">
          {view === "home" ? (
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={14} /> v2.2
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Quranic
                  <br />
                  <span className="text-emerald-200">Transformation</span>
                </h1>
              </div>
              <div className="w-14 h-14 bg-emerald-800/50 rounded-2xl flex items-center justify-center border border-emerald-700/50 backdrop-blur-md">
                <Book size={28} className="text-emerald-200" />
              </div>
            </div>
          ) : (
            <div className="mb-6 pt-2">
              <h1 className="text-4xl font-bold text-white">
                {view === "notes" ? "Reflections" : "Offline Library"}
              </h1>
              <p className="text-emerald-200 text-lg mt-2 opacity-90">
                {view === "notes"
                  ? "Your personal thoughts"
                  : "Available without internet"}
              </p>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-4 text-emerald-800"
              size={24}
            />
            <input
              type="text"
              placeholder={
                view === "notes" ? "Search your notes..." : "Find a lesson..."
              }
              className="w-full bg-white border-2 border-emerald-700 rounded-2xl py-4 pl-12 pr-4 text-emerald-900 text-lg font-semibold placeholder:text-emerald-800/70 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-lg shadow-emerald-900/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-5 -mt-4 relative z-20">
        {/* Category Filters (Home Only) */}
        {view === "home" && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 pt-3">
            {CATEGORIES.map((cat) => {
              const theme = getCategoryTheme(cat);
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-5 py-3 rounded-2xl text-base font-bold uppercase tracking-wide transition-all duration-300 backdrop-blur-md min-h-[52px] ${
                    isActive
                      ? "bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 scale-105 border-2 border-emerald-900"
                      : "bg-white/80 text-emerald-900 border-2 border-white hover:bg-white hover:border-emerald-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {filteredData.length === 0 ? (
          <div className="text-center py-20 opacity-80">
            <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center text-emerald-400 border-2 border-emerald-200">
              {view === "notes" ? <FileText size={40} /> : <Search size={40} />}
            </div>
            <p className="font-bold text-2xl text-emerald-800 mb-2">
              Nothing found.
            </p>
            <p className="text-lg text-emerald-600">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-8 duration-700 space-y-4">
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
          window.scrollTo(0, 0);
        }}
      />

      {/* Detail Modal */}
      {selectedLesson && (
        <LessonDetail
          lesson={selectedLesson}
          hasNote={!!notes[selectedLesson.id]?.content}
          isDownloaded={downloadedIds.has(selectedLesson.id)}
          onClose={() => setSelectedLesson(null)}
          onOpenNote={() => {
            setSelectedLesson(null);
            setActiveNoteLesson(selectedLesson);
          }}
          onOpenPdf={() => {
            setSelectedLesson(null);
            setActivePdfLesson(selectedLesson);
          }}
          onDownload={() => handleDownload(selectedLesson.id)}
        />
      )}

      {/* Note Editor */}
      {activeNoteLesson && (
        <NoteEditor
          lesson={activeNoteLesson}
          initialContent={notes[activeNoteLesson.id]?.content || ""}
          initialIsUrdu={notes[activeNoteLesson.id]?.isUrdu || false}
          onClose={() => setActiveNoteLesson(null)}
          onSave={(content, isUrdu) =>
            handleSaveNote(activeNoteLesson.id, content, isUrdu)
          }
        />
      )}

      {/* PDF Viewer */}
      {activePdfLesson && (
        <div className="fixed inset-0 z-50 bg-[#064E3B] flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-6 py-5 bg-[#064E3B] text-white border-b-2 border-emerald-700">
            <h3 className="font-bold text-xl truncate pr-6">
              {activePdfLesson.title}
            </h3>
            <div className="flex gap-3">
              <a
                href={getDownloadUrl(activePdfLesson.pdfLink)}
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 border-2 border-white/20"
                target="_blank"
              >
                <Download size={24} />
              </a>
              <button
                onClick={() => setActivePdfLesson(null)}
                className="p-3 bg-white/10 rounded-full hover:bg-red-500/80 transition-colors border-2 border-white/20"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          <iframe
            src={getEmbedUrl(activePdfLesson.pdfLink)}
            className="flex-1 w-full border-0 bg-white rounded-t-3xl"
            title="PDF"
          />
        </div>
      )}
    </div>
  );
};

export default App;
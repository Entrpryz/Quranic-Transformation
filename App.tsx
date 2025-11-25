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
    <div className="min-h-screen pb-32 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />

      {/* Hero Header */}
      <div className="relative pt-safe pb-8 rounded-b-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 backdrop-blur-3xl" />

        <div className="px-6 relative z-10 pt-4">
          {view === "home" ? (
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="glass-dark text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={14} /> v2.2
                  </span>
                </div>
                <h1 className="text-5xl font-display font-bold text-white leading-tight tracking-tight">
                  Quranic
                  <br />
                  <span className="gradient-text">Transformation</span>
                </h1>
              </div>
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                <Book size={28} className="text-indigo-300" />
              </div>
            </div>
          ) : (
            <div className="mb-6 pt-2">
              <h1 className="text-4xl font-display font-bold text-white tracking-tight">
                {view === "notes" ? "Reflections" : "Offline Library"}
              </h1>
              <p className="text-indigo-200 text-lg mt-2 opacity-90">
                {view === "notes"
                  ? "Your personal thoughts"
                  : "Available without internet"}
              </p>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-4 text-indigo-300"
              size={24}
            />
            <input
              type="text"
              placeholder={
                view === "notes" ? "Search your notes..." : "Find a lesson..."
              }
              className="w-full glass border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-lg font-semibold placeholder:text-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-300 backdrop-blur-xl"
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
                  className={`whitespace-nowrap px-5 py-3 rounded-2xl text-base font-bold uppercase tracking-wide transition-all duration-300 backdrop-blur-md min-h-[52px] border ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-105 border-transparent"
                      : "glass text-indigo-200 border-white/10 hover:border-indigo-500/30 hover:scale-[1.02]"
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
            <div className="w-24 h-24 glass rounded-full mx-auto mb-6 flex items-center justify-center text-indigo-400 border border-white/10">
              {view === "notes" ? <FileText size={40} /> : <Search size={40} />}
            </div>
            <p className="font-display font-bold text-2xl text-white mb-2 tracking-tight">
              Nothing found.
            </p>
            <p className="text-lg text-indigo-200">
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
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-6 py-5 glass-dark border-b border-white/10">
            <h3 className="font-display font-bold text-xl truncate pr-6 text-white tracking-tight">
              {activePdfLesson.title}
            </h3>
            <div className="flex gap-3">
              <a
                href={getDownloadUrl(activePdfLesson.pdfLink)}
                className="p-3 glass rounded-full hover:bg-indigo-500/20 border border-white/10 transition-all duration-300"
                target="_blank"
              >
                <Download size={24} className="text-indigo-300" />
              </a>
              <button
                onClick={() => setActivePdfLesson(null)}
                className="p-3 glass rounded-full hover:bg-red-500/20 border border-white/10 transition-all duration-300"
              >
                <X size={24} className="text-red-300" />
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
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Download,
  FileText,
  X,
  Sparkles,
  Book,
  Menu,
} from "lucide-react";
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
import Sidebar from "./components/Sidebar";

const App = () => {
  const [view, setView] = useState<"home" | "notes" | "downloads">("home");
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Record<number, Note>>({});
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeNoteLesson, setActiveNoteLesson] = useState<Lesson | null>(null);
  const [activePdfLesson, setActivePdfLesson] = useState<Lesson | null>(null);

  // Scroll preservation
  const scrollPositionRef = useRef<number>(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

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

  // Save scroll position before opening detail view
  const handleOpenLessonDetail = (lesson: Lesson) => {
    scrollPositionRef.current = window.scrollY;
    setSelectedLesson(lesson);
  };

  // Restore scroll position when returning from detail view
  const handleCloseLessonDetail = () => {
    setSelectedLesson(null);
    // Use setTimeout to ensure the DOM has updated
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 100);
  };

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

  // DEEP SEARCH LOGIC - Updated to search all fields
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
          l.topicName.toLowerCase().includes(lower) || // Search topic name
          l.description.toLowerCase().includes(lower) || // Search description
          l.detailedDescription.toLowerCase().includes(lower) || // Search detailed description
          l.surahReference.toLowerCase().includes(lower) || // Search surah reference
          l.surahName.toLowerCase().includes(lower) || // Search surah name
          l.tags.some((tag) => tag.toLowerCase().includes(lower)) // Search tags
      );
    }
    return data;
  }, [view, filterCategory, searchTerm, notes, downloadedIds]);

  const savedNotesCount = Object.values(notes).filter(
    (note: Note) => note.content.trim().length > 0
  ).length;
  const downloadsCount = downloadedIds.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pb-20">
      {/* Modern Header with Islamic Green Theme */}
      <div className="relative pt-safe pb-8 rounded-b-[2rem] overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700">
        {/* Subtle Islamic Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 20C35 20 20 35 20 50s15 30 30 30 30-15 30-30S65 20 50 20zm0 10c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z' fill='%23ffffff'/%3E%3C/svg%3E")`,
            backgroundSize: "60px",
          }}
        />

        <div className="px-6 relative z-10 pt-4">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 border border-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/Quranic-Transformation-logo.png"
                alt="Quranic Transformation"
                className="w-10 h-10 rounded-lg bg-white/20 p-1 border border-white/20"
              />
              <div className="text-right">
                <div className="text-white/80 text-sm font-medium">
                  Welcome to
                </div>
                <div className="text-white font-display font-bold text-lg">
                  Quranic Transform
                </div>
              </div>
            </div>
          </div>

          {view === "home" ? (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={14} /> v3.0
                </span>
              </div>
              <h1 className="text-4xl font-display font-bold text-white leading-tight mb-2">
                Quranic Transformation
              </h1>
              <p className="text-emerald-100 text-lg opacity-90">
                Journey through divine wisdom
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {view === "notes" ? "My Reflections" : "Offline Library"}
              </h1>
              <p className="text-emerald-100 text-base opacity-90">
                {view === "notes"
                  ? "Your personal insights and notes"
                  : "Downloaded materials for offline study"}
              </p>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-4 top-4 text-emerald-600"
              size={20}
            />
            <input
              type="text"
              placeholder={
                view === "notes"
                  ? "Search your reflections..."
                  : "Search topics, surahs, or keywords..."
              }
              className="w-full bg-white border border-emerald-200 rounded-2xl py-3 pl-12 pr-4 text-slate-800 placeholder-emerald-600/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-5 -mt-4 relative z-20" ref={listContainerRef}>
        {/* Category Filters (Home Only) */}
        {view === "home" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 pt-3">
            <button
              onClick={() => setFilterCategory("All")}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                filterCategory === "All"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30"
                  : "bg-white text-emerald-700 border-emerald-200 hover:border-emerald-500/30"
              }`}
            >
              All Topics
            </button>
            {CATEGORIES.map((cat) => {
              const theme = getCategoryTheme(cat);
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    isActive
                      ? `${theme.accent} text-white border-emerald-600 shadow-lg shadow-emerald-500/30`
                      : "bg-white text-emerald-700 border-emerald-200 hover:border-emerald-500/30"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        {filteredData.length > 0 && (
          <div className="text-sm text-emerald-600 font-medium mb-4 px-1">
            {filteredData.length} {filteredData.length === 1 ? "item" : "items"}{" "}
            found
          </div>
        )}

        {filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center text-emerald-400 border border-emerald-200 shadow-lg">
              {view === "notes" ? <FileText size={32} /> : <Search size={32} />}
            </div>
            <p className="font-display font-bold text-xl text-slate-800 mb-2">
              {searchTerm ? "No results found" : "Nothing here yet"}
            </p>
            <p className="text-emerald-600">
              {searchTerm
                ? "Try a different search term"
                : view === "notes"
                ? "Start writing reflections to see them here"
                : "Download materials to access them offline"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {filteredData.map((lesson) => (
              <div key={lesson.id} id={`topic-${lesson.id}`}>
                <LessonCard
                  lesson={lesson}
                  hasNote={!!notes[lesson.id]?.content}
                  isDownloaded={downloadedIds.has(lesson.id)}
                  onClick={() => handleOpenLessonDetail(lesson)}
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

      {/* Sidebar */}
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

      {/* Detail Modal */}
      {selectedLesson && (
        <LessonDetail
          lesson={selectedLesson}
          hasNote={!!notes[selectedLesson.id]?.content}
          isDownloaded={downloadedIds.has(selectedLesson.id)}
          onClose={handleCloseLessonDetail}
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
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 border-b border-emerald-200">
            <h3 className="font-display font-bold text-lg truncate pr-6 text-white">
              {activePdfLesson.topicName}
            </h3>
            <div className="flex gap-2">
              <a
                href={getDownloadUrl(activePdfLesson.presentationLink)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 border border-white/20 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={20} className="text-white" />
              </a>
              <button
                onClick={() => setActivePdfLesson(null)}
                className="p-2 bg-white/20 rounded-lg hover:bg-red-500/30 border border-white/20 transition-all duration-200"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>
          <iframe
            src={getEmbedUrl(activePdfLesson.presentationLink)}
            className="flex-1 w-full border-0"
            title="PDF"
          />
        </div>
      )}
    </div>
  );
};

export default App;

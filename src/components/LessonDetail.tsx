"use client";
import React, { useState } from "react";
import {
  X,
  Clock,
  BookOpen,
  Download,
  Edit3,
  FileText,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { Lesson, getCategoryTheme, getDownloadUrl } from "@/lib/constants";
import { Gulzar } from "next/font/google";

const gulzar = Gulzar({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
});

interface LessonDetailProps {
  lesson: Lesson;
  hasNote: boolean;
  isDownloaded: boolean;
  onClose: () => void;
  onOpenNote: () => void;
  onDownload: () => void;
  onOpenPdf: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  hasNote,
  isDownloaded,
  onClose,
  onOpenNote,
  onDownload,
  onOpenPdf,
}) => {
  const theme = getCategoryTheme(lesson.part);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (isDownloaded || downloading) return;
    setDownloading(true);

    const link = document.createElement("a");
    link.href = getDownloadUrl(lesson.presentationLink);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      onDownload();
      setDownloading(false);
    }, 1500);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-60 animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-70 animate-in slide-in-from-bottom duration-300 bg-white rounded-t-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-t border-white/20">
        {/* Header */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-pointer"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-safe no-scrollbar">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <span
                className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${theme.badge}`}
              >
                {lesson.part}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-2 leading-tight">
                {lesson.topicName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors ml-4"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <BookOpen size={16} />
              <span>{lesson.surahName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Clock size={16} />
              <span>{lesson.hours}h</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
              {lesson.detailedDescription}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="text-right">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                Urdu Title
              </p>
              {/* Strict Font Application */}
              <h3
                className={`${gulzar.className} text-[1.6em] text-emerald-800 leading-loose font-normal`}
              >
                {lesson.urduTitle}
              </h3>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <p className="text-slate-700 leading-relaxed text-sm">
                {lesson.description}
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-100 flex justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                <span>Verses</span>
                <span>{lesson.verses}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-8">
            <button
              onClick={onOpenNote}
              className={`col-span-2 py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] border ${
                hasNote
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
              }`}
            >
              <Edit3 size={18} />
              {hasNote ? "Edit Reflection" : "Write Reflection"}
              <Pencil size={14} className="opacity-50" />
            </button>

            {lesson.presentationLink ? (
              <>
                <button
                  onClick={onOpenPdf}
                  className="py-3.5 px-4 rounded-xl bg-linear-to-r from-emerald-600 to-teal-700 text-white font-semibold flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  <FileText size={20} />
                  <span className="text-xs">Read PDF</span>
                </button>
                <button
                  onClick={handleDownload}
                  className={`py-3.5 px-4 rounded-xl border font-semibold flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                    isDownloaded
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
                >
                  {downloading ? (
                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : isDownloaded ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Download size={20} />
                  )}
                  <span className="text-xs">
                    {isDownloaded ? "Saved" : "Download"}
                  </span>
                </button>
              </>
            ) : (
              <div className="col-span-2 p-3 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-100">
                No PDF Material
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonDetail;

import React, { useState } from "react";
import {
  X,
  Clock,
  BookOpen,
  Download,
  Edit3,
  FileText,
  CheckCircle,
  Tag,
  Pencil,
} from "lucide-react";
import { Lesson, getCategoryTheme, getDownloadUrl } from "../constants";

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

    // Trigger download
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
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 transform transition-transform animate-in slide-in-from-bottom duration-300 bg-white rounded-t-[2rem] shadow-[0_-20px_60px_rgba(5,150,105,0.3)] overflow-hidden max-h-[92vh] flex flex-col border border-emerald-200">
        {/* Handle Bar */}
        <div className="flex justify-center pt-4 pb-2" onClick={onClose}>
          <div className="w-16 h-1 bg-emerald-300 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-safe">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${theme.badge}`}
              >
                {lesson.part}
              </span>
              <h2 className="text-2xl font-bold text-slate-800 mt-3 leading-tight">
                {lesson.topicName}
              </h2>
              <p className="text-base text-emerald-700 font-medium mt-1">
                {lesson.surahReference}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-emerald-50 rounded-xl text-emerald-600 hover:bg-red-500/20 border border-emerald-200 focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 ml-4"
            >
              <X size={20} />
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 mb-6 text-base font-semibold text-emerald-700 border-b border-emerald-200 pb-4">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" />
              <span>{lesson.surahName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" />
              <span>{lesson.hours} Hours</span>
            </div>
          </div>

          {/* Tags */}
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lesson.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          <div className="mb-6">
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <p className="text-slate-700 leading-relaxed text-base">
                {lesson.detailedDescription}
              </p>
            </div>
          </div>

          {/* Urdu Title & Desc */}
          <div className="space-y-6 mb-8">
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">
                Urdu Title
              </p>
              <h3 className="font-urdu text-2xl text-emerald-800 leading-loose font-bold">
                {lesson.urduTitle}
              </h3>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-slate-700 leading-relaxed text-base">
                {lesson.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <span>Verse Range</span>
                <span>{lesson.verses}</span>
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-3 pb-6">
            <button
              onClick={onOpenNote}
              className={`col-span-2 py-4 px-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm border ${
                hasNote
                  ? "bg-amber-500/20 text-amber-700 border-amber-500/30"
                  : "bg-white text-emerald-700 border-emerald-200 hover:border-emerald-500/30 hover:text-emerald-800 focus:ring-2 focus:ring-emerald-500/50"
              }`}
            >
              <Edit3 size={20} />
              {hasNote ? "Edit Reflection" : "Write Reflection"}
              <Pencil size={16} />
            </button>

            {lesson.presentationLink ? (
              <>
                <button
                  onClick={onOpenPdf}
                  className="py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 border border-transparent focus:ring-2 focus:ring-emerald-500/50"
                >
                  <FileText size={24} />
                  <span className="text-sm">Read PDF</span>
                </button>
                <button
                  onClick={handleDownload}
                  className={`py-4 px-4 rounded-xl border font-semibold flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 focus:ring-2 focus:ring-emerald-500/50 ${
                    isDownloaded
                      ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-700"
                      : "bg-white border-emerald-200 text-emerald-700 hover:border-emerald-500/30 hover:text-emerald-800"
                  }`}
                >
                  {downloading ? (
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : isDownloaded ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Download size={24} />
                  )}
                  <span className="text-sm">
                    {isDownloaded ? "Saved" : "Download"}
                  </span>
                </button>
              </>
            ) : (
              <div className="col-span-2 p-4 text-center text-emerald-600 text-base italic bg-emerald-50 rounded-xl border border-emerald-200">
                No PDF Material Available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonDetail;
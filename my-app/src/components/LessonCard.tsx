"use client";
import React from "react";
import { BookOpen, ChevronRight, CheckCircle, StickyNote } from "lucide-react";
import { Lesson, getCategoryTheme } from "@/lib/constants";

interface LessonCardProps {
  lesson: Lesson;
  hasNote: boolean;
  isDownloaded: boolean;
  onClick: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  hasNote,
  isDownloaded,
  onClick,
}) => {
  const theme = getCategoryTheme(lesson.part);

  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left bg-white rounded-2xl p-1 mb-4 border border-emerald-200 hover:border-emerald-400 shadow-sm hover:shadow-lg transition-all duration-200 active:scale-[0.98] focus:ring-2 focus:ring-emerald-500/50"
    >
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white">
        {/* Green Icon Box */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md ${theme.gradient}`}
        >
          {lesson.id}
        </div>

        <div className="flex-1 min-w-0 py-1">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${theme.badge} border-emerald-500/20`}
            >
              {lesson.part}
            </span>
          </div>

          {/* Topic Name */}
          <h3 className="text-lg font-semibold text-slate-800 leading-tight mb-1 pr-2 line-clamp-2">
            {lesson.topicName}
          </h3>

          {/* Surah Reference */}
          <p className="text-sm text-emerald-700 font-medium mb-2">
            {lesson.surahReference}
          </p>

          <div className="flex items-center gap-3 text-sm text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen size={14} className={theme.icon} />
              {lesson.surahName}
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-500/30"></span>
            <span>{lesson.hours} hours</span>

            {(hasNote || isDownloaded) && (
              <div className="flex items-center gap-1 ml-auto">
                {hasNote && (
                  <StickyNote
                    size={16}
                    className="text-amber-500 fill-amber-500/20"
                  />
                )}
                {isDownloaded && (
                  <CheckCircle
                    size={16}
                    className="text-emerald-500 fill-emerald-500/20"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-200 group-hover:text-emerald-700 group-hover:border-emerald-400 transition-all duration-200">
          <ChevronRight size={16} />
        </div>
      </div>
    </button>
  );
};

export default LessonCard;
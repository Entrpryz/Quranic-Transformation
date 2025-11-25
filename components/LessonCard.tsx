import React from "react";
import {
  BookOpen,
  ChevronRight,
  CheckCircle,
  StickyNote,
} from "lucide-react";
import { Lesson, getCategoryTheme } from "../constants";

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
      className="group relative w-full text-left bg-white rounded-3xl p-2 mb-5 shadow-lg hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 ease-out active:scale-[0.98] border-2 border-slate-100 focus:ring-4 focus:ring-emerald-500/30"
    >
      <div className="flex items-center gap-5 p-5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200">
        {/* Gradient Icon Box */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-serif text-white shadow-lg bg-gradient-to-br ${theme.gradient} ${theme.shadow} shrink-0 border-2 border-white`}
        >
          {lesson.id}
        </div>

        <div className="flex-1 min-w-0 py-2">
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border-2 ${theme.badge} border-emerald-200`}
            >
              {lesson.part}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 truncate pr-2 font-serif">
            {lesson.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-slate-600 font-semibold">
            <span className="flex items-center gap-2">
              <BookOpen size={16} className={theme.icon} />
              {lesson.surahName}
            </span>
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>{lesson.hours} hours</span>

            {(hasNote || isDownloaded) && (
              <div className="flex items-center gap-2 ml-auto">
                {hasNote && (
                  <StickyNote
                    size={18}
                    className="text-amber-600 fill-amber-600"
                  />
                )}
                {isDownloaded && (
                  <CheckCircle
                    size={18}
                    className="text-emerald-600 fill-emerald-600"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm border-2 border-slate-100 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors">
          <ChevronRight size={20} />
        </div>
      </div>
    </button>
  );
};

export default LessonCard;
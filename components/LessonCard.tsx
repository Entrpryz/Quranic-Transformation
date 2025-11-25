import React from "react";
import { BookOpen, ChevronRight, CheckCircle, StickyNote } from "lucide-react";
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
      className="group relative w-full text-left glass rounded-3xl p-2 mb-5 border border-white/10 hover:border-indigo-500/30 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 ease-out active:scale-[0.98] focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-xl"
    >
      <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/5">
        {/* Glass Icon Box */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-display text-white shadow-lg backdrop-blur-md border border-white/10 ${theme.gradient}`}
        >
          {lesson.id}
        </div>

        <div className="flex-1 min-w-0 py-2">
          {/* Top Label */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${theme.badge} border-indigo-500/20 backdrop-blur-sm`}
            >
              {lesson.part}
            </span>
          </div>

          <h3 className="text-xl font-display font-bold text-white leading-tight mb-2 truncate pr-2 tracking-tight">
            {lesson.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-indigo-200 font-semibold">
            <span className="flex items-center gap-2">
              <BookOpen size={16} className={theme.icon} />
              {lesson.surahName}
            </span>
            <span className="w-2 h-2 rounded-full bg-indigo-500/30"></span>
            <span>{lesson.hours} hours</span>

            {(hasNote || isDownloaded) && (
              <div className="flex items-center gap-2 ml-auto">
                {hasNote && (
                  <StickyNote
                    size={18}
                    className="text-amber-400 fill-amber-400/20"
                  />
                )}
                {isDownloaded && (
                  <CheckCircle
                    size={18}
                    className="text-emerald-400 fill-emerald-400/20"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-indigo-300 border border-white/10 group-hover:text-indigo-200 group-hover:border-indigo-500/30 transition-all duration-300">
          <ChevronRight size={20} />
        </div>
      </div>
    </button>
  );
};

export default LessonCard;
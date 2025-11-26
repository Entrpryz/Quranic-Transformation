"use client";

import React from "react";
import { Clock, CheckCircle2, StickyNote, ArrowUpRight } from "lucide-react";
import { Lesson } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all duration-300",
        "bg-card border border-border/50",
        "hover:border-emerald-500/40 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1"
      )}
    >
      {/* Gradient Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:to-emerald-500/5 transition-all duration-500" />

      {/* Top Row */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <Badge
          variant="outline"
          className="text-[10px] font-medium px-2 py-0.5 border-zinc-800 text-zinc-400 bg-zinc-900 group-hover:bg-zinc-800 transition-colors"
        >
          {lesson.part}
        </Badge>

        <div className="flex gap-2">
          {hasNote && (
            <div className="bg-amber-500/10 p-1 rounded-md">
              <StickyNote className="w-3.5 h-3.5 text-amber-500" />
            </div>
          )}
          {isDownloaded && (
            <div className="bg-emerald-500/10 p-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 flex-1 relative z-10">
        {/* Urdu Title - Gulzar Font */}
        <h3 className="font-gulzar text-2xl text-right text-emerald-400/90 leading-relaxed group-hover:text-emerald-400 transition-colors drop-shadow-sm">
          {lesson.urduTitle}
        </h3>

        {/* English Title */}
        <div>
          <h4 className="font-semibold text-zinc-100 text-lg leading-snug line-clamp-2 mb-1 group-hover:text-white">
            {lesson.topicName}
          </h4>
          <p className="text-xs text-zinc-500 font-mono">
            #{lesson.id.toString().padStart(3, "0")}
          </p>
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-dashed border-zinc-800 group-hover:border-zinc-700 flex items-center justify-between relative z-10 transition-colors">
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{lesson.hours}h</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="truncate max-w-[100px]">{lesson.surahName}</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
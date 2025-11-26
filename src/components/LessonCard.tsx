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
        "group relative flex flex-col justify-between p-5 rounded-xl cursor-pointer transition-all duration-300",
        "bg-card border border-border",
        "hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-1"
      )}
    >
      {/* Top Row: ID, Badge, Indicators */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
            #{lesson.id.toString().padStart(3, "0")}
          </span>
          <Badge
            variant="outline"
            className="text-[10px] h-5 px-1.5 border-zinc-800 text-zinc-400 bg-zinc-900/50"
          >
            {lesson.part}
          </Badge>
        </div>
        <div className="flex gap-2">
          {hasNote && <StickyNote className="w-4 h-4 text-amber-500" />}
          {isDownloaded && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 flex-1">
        {/* Urdu Title - Explicitly using Gulzar font */}
        <h3 className="font-gulzar text-2xl text-right text-emerald-400 leading-normal group-hover:text-emerald-300 transition-colors mt-1">
          {lesson.urduTitle}
        </h3>

        {/* English Title */}
        <h4 className="font-medium text-zinc-100 text-lg leading-snug line-clamp-2">
          {lesson.topicName}
        </h4>

        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="w-3 h-3" />
          <span>{lesson.hours}h</span>
          <span>•</span>
          <span className="truncate max-w-[100px]">{lesson.surahName}</span>
        </div>

        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
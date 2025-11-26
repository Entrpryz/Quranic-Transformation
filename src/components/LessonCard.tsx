"use client";

import React from "react";
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  StickyNote,
  Clock,
  FileText,
} from "lucide-react";
import { Lesson, getCategoryTheme } from "@/lib/constants";
import { Gulzar } from "next/font/google";

// Shadcn UI Imports
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const gulzar = Gulzar({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-gulzar",
});

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
    <Card
      className={cn(
        "group w-full p-0 mb-4 rounded-2xl cursor-pointer transition-all duration-300 ease-out",
        "bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm",
        "hover:shadow-lg hover:shadow-emerald-100/50 hover:border-emerald-200/60",
        "hover:scale-[1.02] active:scale-[0.99]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Header with Gradient Background */}
        <div
          className={cn(
            "relative px-6 py-4 rounded-t-2xl",
            "bg-linear-to-r from-slate-50 to-emerald-50/70",
            "border-b border-slate-200/60"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Lesson ID with Islamic geometric pattern inspiration */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  "bg-white border border-slate-200 shadow-sm",
                  "transition-all duration-300 group-hover:shadow-md",
                  theme.gradient
                )}
              >
                <span className="text-sm font-bold text-white">
                  {lesson.id}
                </span>
              </div>

              {/* Part Badge */}
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold border-0 shadow-sm",
                  "bg-emerald-600 text-white hover:bg-emerald-700",
                  "transition-colors duration-300"
                )}
              >
                {lesson.part}
              </Badge>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {hasNote && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200/60">
                  <StickyNote
                    size={16}
                    className="text-amber-600 fill-amber-600/20"
                  />
                </div>
              )}
              {isDownloaded && (
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/60">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 fill-emerald-600/20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* English Title */}
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-slate-400" />
            <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide truncate">
              {lesson.topicName}
            </h3>
          </div>

          {/* Urdu Title - Centerpiece */}
          <div
            className={cn(
              gulzar.className,
              "relative py-6 px-4 mb-4 rounded-xl",
              "bg-slate-50/80 border border-slate-200/60",
              "text-2xl text-emerald-800 leading-[2.2] text-right",
              "transition-all duration-300",
              "group-hover:bg-white group-hover:border-emerald-200/40",
              "group-hover:text-emerald-900 group-hover:shadow-inner"
            )}
            dir="rtl"
          >
            {lesson.urduTitle}
            
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-emerald-300/60 rounded-tl"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-emerald-300/60 rounded-tr"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-emerald-300/60 rounded-bl"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-emerald-300/60 rounded-br"></div>
          </div>

          <Separator className="bg-slate-200/60 mb-4" />

          {/* Footer Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {/* Surah Name */}
              <div className="flex items-center gap-2 transition-colors group-hover:text-emerald-700">
                <BookOpen size={16} className="text-emerald-500" />
                <span className="font-medium">{lesson.surahName}</span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 transition-colors group-hover:text-slate-600">
                <Clock size={16} className="text-slate-400" />
                <span className="font-medium">{lesson.hours}h</span>
              </div>
            </div>

            {/* Action Indicator */}
            <div className="flex items-center gap-2 text-slate-400 transition-colors group-hover:text-emerald-600">
              <span className="text-sm font-medium">View</span>
              <ChevronRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
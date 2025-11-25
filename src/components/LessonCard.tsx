"use client";

import React from "react";
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  StickyNote,
  PlayCircle,
} from "lucide-react";
import { Lesson, getCategoryTheme } from "@/lib/constants";
import { Gulzar } from "next/font/google";

// Shadcn UI Imports
import { Button } from "@/components/ui/button"; // Imported Button Component
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
  // Retrieve dynamic colors based on the category (Part)
  const theme = getCategoryTheme(lesson.part);

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "group h-auto w-full p-0 mb-3 rounded-xl",
        "justify-start whitespace-normal font-normal", // Reset text alignment and wrapping
        "hover:bg-transparent" // Disable default ghost hover bg to let Card handle it
      )}
    >
      <Card
        className={cn(
          "relative w-full overflow-hidden border-slate-200 text-left transition-all duration-300 ease-out",
          "bg-white/95 backdrop-blur-sm",
          "hover:border-emerald-300/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white",
          "group-hover:scale-[1.02] group-active:scale-[0.98]"
        )}
      >
        {/* Decorative "Book Spine" using absolute positioning */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5 opacity-80 transition-opacity group-hover:opacity-100",
            theme.gradient
          )}
        />

        <CardContent className="flex items-start gap-4 p-4 pl-5">
          {/* Left Column: ID & Icon */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors",
                "bg-slate-50 border-slate-100 text-slate-500",
                "group-hover:border-emerald-200 group-hover:text-emerald-600"
              )}
            >
              <span className="text-sm font-bold">{lesson.id}</span>
            </div>
          </div>

          {/* Middle Column: Content */}
          <div className="flex-1 min-w-0">
            {/* Header: Badge & English Title */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold border-opacity-40",
                  theme.badge
                )}
              >
                {lesson.part}
              </Badge>
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
                {lesson.topicName}
              </h3>
            </div>

            {/* Core: Urdu Title */}
            <div
              className={cn(
                gulzar.className,
                "text-xl sm:text-2xl text-slate-800 transition-colors leading-[2.2] text-right w-full pr-1",
                "group-hover:text-emerald-800"
              )}
              dir="rtl"
            >
              {lesson.urduTitle}
            </div>

            {/* Footer Section */}
            <Separator className="my-3 bg-slate-100" />

            <div className="flex items-center justify-between">
              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-emerald-600">
                  <BookOpen size={13} className="text-emerald-500/70" />
                  {lesson.surahName}
                </span>

                <span className="h-1 w-1 rounded-full bg-slate-200" />

                <span className="flex items-center gap-1">
                  <PlayCircle size={13} className="text-slate-300" />
                  {lesson.hours}h
                </span>
              </div>

              {/* Status Indicators (Notes/Downloads) */}
              <div className="flex items-center gap-2">
                {(hasNote || isDownloaded) && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-2 py-1 h-auto font-normal border-slate-100"
                  >
                    {hasNote && (
                      <StickyNote
                        size={14}
                        className="text-amber-500 fill-amber-500/10"
                      />
                    )}
                    {isDownloaded && (
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 fill-emerald-500/10"
                      />
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Chevron */}
          <div className="flex h-full items-center pl-1 self-center">
            <ChevronRight
              size={18}
              className="text-slate-300 transition-all group-hover:text-emerald-500 group-hover:translate-x-0.5"
            />
          </div>
        </CardContent>
      </Card>
    </Button>
  );
};

export default LessonCard;
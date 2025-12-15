"use client";

import React from "react";
import {
  Clock,
  CheckCircle2,
  StickyNote,
  ArrowUpRight,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { Lesson } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider delayDuration={200}>
      <Card
        onClick={onClick}
        className={cn(
          "group relative flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300",
          "bg-zinc-950/50 border-zinc-800/60 backdrop-blur-sm",
          "hover:border-emerald-500/30 hover:bg-zinc-900/80 hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1"
        )}
      >
        {/* Decorative Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-transparent to-transparent group-hover:from-emerald-500/5 transition-all duration-500 pointer-events-none" />

        <CardHeader className="flex flex-row items-start justify-between p-5 pb-2 relative z-10 space-y-0">
          <Badge
            variant="outline"
            className="rounded-md border-zinc-700 bg-zinc-800/50 text-xs font-medium text-zinc-400 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors"
          >
            {lesson.part}
          </Badge>

          <div className="flex gap-2">
            {hasNote && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20 transition-transform group-hover:scale-110">
                    <StickyNote className="h-3.5 w-3.5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Personal Note Added</p>
                </TooltipContent>
              </Tooltip>
            )}
            {isDownloaded && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20 transition-transform group-hover:scale-110">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Downloaded for Offline</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 p-5 pt-2 relative z-10">
          {/* Urdu Title - Preserved Font & Styling */}
          <div className="flex justify-end">
            <h3 className="font-gulzar text-2xl md:text-3xl text-right text-emerald-100/90 leading-[1.6] drop-shadow-sm group-hover:text-emerald-400 transition-colors duration-300 dir-rtl">
              {lesson.urduTitle}
            </h3>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-lg font-semibold text-zinc-100 leading-snug tracking-tight group-hover:text-white transition-colors line-clamp-2">
              {lesson.topicName}
            </h4>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
              <span>ID: #{lesson.id.toString().padStart(3, "0")}</span>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
            {lesson.description}
          </p>
        </CardContent>

        <CardFooter className="mt-auto border-t border-zinc-800/50 bg-zinc-900/30 p-4 relative z-10 flex items-center justify-between group-hover:bg-zinc-900/50 transition-colors">
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 group-hover:text-zinc-400">
            <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{lesson.hours}h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{lesson.surahName}</span>
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-emerald-500/20 group-hover:scale-110">
            {isDownloaded ? (
              <PlayCircle className="h-4 w-4 fill-current" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default LessonCard;
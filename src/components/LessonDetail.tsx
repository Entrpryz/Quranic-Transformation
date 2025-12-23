"use client";

import React, { useEffect } from "react";
import {
  X,
  Clock,
  Download,
  FileText,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Lesson, getDownloadUrl } from "@/lib/constants";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  useEffect(() => {
    const trackProgress = async () => {
      try {
        await fetch("/api/progress", {
          method: "POST",
          body: JSON.stringify({ lessonId: lesson.id }),
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Failed to track progress", error);
      }
    };
    trackProgress();
  }, [lesson.id]);

  const handleForceDownload = () => {
    onDownload();
    if (lesson.presentationLink) {
      const link = document.createElement("a");
      link.href = getDownloadUrl(lesson.presentationLink);
      link.download = `${lesson.topicName}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      {/* Custom DialogContent styles:
        - Hiding default close button to use our custom one in the header
        - Max-width and height adjustments for responsive design
      */}
      <DialogContent className="max-w-3xl p-0 gap-0 bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden outline-none [&>button]:hidden shadow-2xl shadow-black/90">
        {/* --- Header Section --- */}
        <div className="relative p-6 md:p-8 pb-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1"
              >
                {lesson.part}
              </Badge>
              <Badge
                variant="outline"
                className="border-zinc-700 text-zinc-400 font-mono text-xs"
              >
                #{lesson.id.toString().padStart(3, "0")}
              </Badge>
              {isDownloaded && (
                <Badge
                  variant="secondary"
                  className="bg-zinc-800 text-zinc-400 gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" /> Offline Ready
                </Badge>
              )}
            </div>

            {/* Title Block */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-2">
                {lesson.topicName}
              </h2>
              <p className="font-gulzar text-xl md:text-2xl text-emerald-400/90 leading-relaxed dir-rtl mb-4">
                {lesson.urduTitle}
              </p>

              <div className="flex items-center gap-4 text-sm text-zinc-400 font-medium border-t border-zinc-800/50 pt-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span>{lesson.hours}h Duration</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-zinc-500" />
                  <span>{lesson.surahName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Scrollable Content --- */}
        <ScrollArea className="max-h-[60vh] md:max-h-[500px] w-full bg-zinc-950">
          <div className="p-6 md:p-8 space-y-8">
            {/* Description */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Lesson Overview
              </h4>
              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
                  {lesson.detailedDescription || lesson.description}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* --- Footer Actions --- */}
        <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Primary Action: Notes */}
          <Button
            onClick={onOpenNote}
            className={`w-full sm:w-auto min-w-[180px] h-11 text-base font-medium shadow-lg transition-all ${
              hasNote
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-900/20"
                : "bg-zinc-100 text-zinc-900 hover:bg-white"
            }`}
          >
            {hasNote ? (
              <>
                <FileText className="mr-2 h-4 w-4" /> Edit Reflection
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Add Reflection
              </>
            )}
          </Button>

          {/* Secondary Actions Group */}
          {lesson.presentationLink && (
            <div className="flex w-full sm:w-auto gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onOpenPdf}
                      variant="secondary"
                      className="flex-1 sm:flex-none h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    >
                      <BookOpen className="mr-2 h-4 w-4" /> Read PDF
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View presentation slides</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                onClick={handleForceDownload}
                variant="outline"
                className={`flex-1 sm:flex-none h-11 border-zinc-700 transition-colors ${
                  isDownloaded
                    ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                disabled={isDownloaded}
              >
                {isDownloaded ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Saved
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDetail;

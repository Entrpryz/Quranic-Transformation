"use client";
import React, { useState } from "react";
import {
  X,
  Clock,
  BookOpen,
  Download,
  Edit3,
  FileText,
  CheckCircle,
  Bookmark,
  Share2,
} from "lucide-react";
import { Lesson, getCategoryTheme, getDownloadUrl } from "@/lib/constants";
import { Gulzar } from "next/font/google";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const gulzar = Gulzar({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
});

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with gradient background */}
        <DialogHeader className="p-6 pb-4 space-y-4 bg-linear-to-br from-emerald-50 via-teal-50 to-slate-50 border-b border-slate-200/60">
          <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${theme.badge} border-0`}
                >
                  {lesson.part}
                </Badge>
                <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.hours}h
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 leading-tight pr-12">
                {lesson.topicName}
              </h2>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:bg-white hover:border-slate-300 transition-all"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-white/60 px-3 py-1.5 rounded-lg border border-emerald-100">
              <BookOpen className="h-4 w-4" />
              <span>{lesson.surahName}</span>
            </div>
            
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[60vh]">
          {/* Description Card */}
          <Card className="border-slate-200/60 bg-slate-50/50 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {lesson.detailedDescription}
              </p>
            </CardContent>
          </Card>

          {/* Urdu Title Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Urdu Title
              </span>
              <div className="h-px flex-1 bg-linear-to-r from-emerald-100 to-transparent ml-3"></div>
            </div>
            
            <Card className="bg-emerald-50/30 border-emerald-100 shadow-sm">
              <CardContent className="p-4">
                <h3 className={`${gulzar.className} text-2xl text-emerald-800 leading-loose text-right font-normal`}>
                  {lesson.urduTitle}
                </h3>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Details Card */}
          <Card className="border-teal-100 bg-linear-to-br from-teal-50/40 to-emerald-50/40 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                {lesson.description}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-teal-100/50">
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                  Verses
                </span>
                <Badge variant="outline" className="text-teal-700 border-teal-200 bg-white/60">
                  {lesson.verses}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Lesson Progress</span>
              <span>25%</span>
            </div>
            <Progress value={25} className="h-2 bg-slate-200/60" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onOpenNote}
              variant={hasNote ? "default" : "outline"}
              className={`h-12 rounded-xl gap-2 transition-all ${
                hasNote 
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/25" 
                  : "border-slate-300 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              {hasNote ? "Edit Notes" : "Take Notes"}
            </Button>

            {lesson.presentationLink ? (
              <>
                <Button
                  onClick={onOpenPdf}
                  className="h-12 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <FileText className="h-4 w-4" />
                  Read PDF
                </Button>
                
                <Button
                  onClick={handleDownload}
                  variant={isDownloaded ? "secondary" : "outline"}
                  disabled={downloading}
                  className="h-12 rounded-xl gap-2 col-span-2 transition-all border-slate-300 hover:border-emerald-300"
                >
                  {downloading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : isDownloaded ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">Downloaded Successfully</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download Material</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Card className="col-span-2 border-slate-200/60 bg-slate-50/50">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-slate-500">No PDF material available for this lesson</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDetail;
"use client";
import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { Lesson, getEmbedUrl, getDownloadUrl } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  lesson: Lesson;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ lesson, onClose }) => {
  // Lock body scroll to prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 animate-in fade-in duration-300">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shadow-md z-10">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-100 truncate max-w-[150px] md:max-w-md">
            {lesson.topicName}
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">
            Reader Mode
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() =>
              window.open(getDownloadUrl(lesson.presentationLink), "_blank")
            }
          >
            <ExternalLink className="w-4 h-4" />
            Open in Browser
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 relative w-full h-full bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
        <div className="w-full h-full md:rounded-lg overflow-hidden bg-white shadow-2xl">
          {/* Using iframe is the most robust way to view PDFs without heavy libraries like PDF.js.
                Ensure 'getEmbedUrl' returns a Google Viewer link or direct PDF link.
            */}
          <iframe
            src={getEmbedUrl(lesson.presentationLink)}
            className="w-full h-full border-0"
            title={`PDF - ${lesson.topicName}`}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
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
  // Prevent body scroll when PDF is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    // Z-Index 50 ensures it sits above everything.
    // bg-zinc-950 ensures it is OPAQUE (fixes transparent issue).
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 animate-in fade-in duration-200">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-zinc-100 truncate max-w-[200px] md:max-w-md">
            {lesson.topicName}
          </h3>
          <span className="text-xs text-zinc-500">PDF Reader Mode</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-2 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
            onClick={() =>
              window.open(getDownloadUrl(lesson.presentationLink), "_blank")
            }
          >
            <ExternalLink className="w-4 h-4" />
            Open External
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-red-900/30 hover:text-red-400 text-zinc-400"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative bg-zinc-900 w-full h-full">
        {/* We use a white background for the iframe itself because PDF renderers often expect light backgrounds */}
        <iframe
          src={getEmbedUrl(lesson.presentationLink)}
          className="w-full h-full border-0 bg-white"
          title={`PDF - ${lesson.topicName}`}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default PdfViewer;
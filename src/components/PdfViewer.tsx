"use client";
import React from "react";
import { Download, X } from "lucide-react";
import { Lesson, getEmbedUrl, getDownloadUrl } from "@/lib/constants";

interface PdfViewerProps {
  lesson: Lesson;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ lesson, onClose }) => {
  return (
    <div className="fixed inset-0 z-80 bg-white flex flex-col animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
        <h3 className="font-bold text-sm truncate pr-4 text-slate-200">
          {lesson.topicName}
        </h3>
        <div className="flex gap-2 shrink-0">
          <a
            href={getDownloadUrl(lesson.presentationLink)}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={18} />
          </a>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <iframe
        src={getEmbedUrl(lesson.presentationLink)}
        className="flex-1 w-full border-0 bg-slate-100"
        title="PDF"
      />
    </div>
  );
};

export default PdfViewer;

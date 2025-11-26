"use client";
import React, { useState, useEffect } from "react";
import { X, Download, Save, Languages } from "lucide-react";
import { Lesson } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface NoteEditorProps {
  lesson: Lesson;
  initialContent: string;
  initialIsUrdu: boolean;
  onClose: () => void;
  onSave: (content: string, isUrdu: boolean) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  lesson,
  initialContent,
  initialIsUrdu,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(initialContent);
  const [isUrdu, setIsUrdu] = useState(initialIsUrdu);
  const [status, setStatus] = useState("Saved");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== initialContent || isUrdu !== initialIsUrdu) {
        setStatus("Saving...");
        onSave(content, isUrdu);
        setTimeout(() => setStatus("Saved"), 800);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, isUrdu, initialContent, initialIsUrdu, onSave]);

  const handleDownloadNote = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lesson.topicName.replace(/\s+/g, "_")}_Reflection.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 w-full h-full md:max-w-4xl md:h-[85vh] md:rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex flex-col">
            <h3 className="text-zinc-100 font-semibold truncate max-w-[200px] md:max-w-md">
              {lesson.topicName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Save
                size={12}
                className={status === "Saving..." ? "animate-spin" : ""}
              />
              <span>{status}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUrdu(!isUrdu)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
            >
              <Languages size={14} className="mr-2" />
              {isUrdu ? "Switch to English" : "Switch to Urdu"}
            </Button>

            <div className="w-px h-6 bg-zinc-800 mx-1 hidden sm:block"></div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownloadNote}
              title="Download Note"
              className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 hidden sm:flex"
            >
              <Download size={18} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 ml-1"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative bg-zinc-950">
          <textarea
            className={`w-full h-full bg-transparent p-6 md:p-8 resize-none focus:outline-none text-zinc-200 leading-relaxed custom-scrollbar ${
              isUrdu
                ? "font-gulzar text-2xl md:text-3xl text-right placeholder:text-zinc-700"
                : "font-sans text-base md:text-lg text-left placeholder:text-zinc-700"
            }`}
            placeholder={
              isUrdu
                ? "یہاں اپنی سوچ لکھیں..."
                : "Start typing your reflections here..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            dir={isUrdu ? "rtl" : "ltr"}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
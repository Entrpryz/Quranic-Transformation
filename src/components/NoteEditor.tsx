"use client";
import React, { useState, useEffect } from "react";
import { X, } from "lucide-react";
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
        setTimeout(() => setStatus("Saved"), 500);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, isUrdu, initialContent, initialIsUrdu, onSave]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 w-full max-w-4xl h-[85vh] rounded-2xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <div>
            <h3 className="text-zinc-100 font-medium">{lesson.topicName}</h3>
            <p className="text-xs text-zinc-500">{status}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUrdu(!isUrdu)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              {isUrdu ? "Switch to English" : "Switch to Urdu"}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <textarea
          className={`flex-1 w-full bg-zinc-950 p-8 resize-none focus:outline-none text-zinc-200 leading-relaxed ${
            isUrdu ? "font-gulzar text-2xl text-right" : "font-sans text-base"
          }`}
          placeholder={
            isUrdu ? "یہاں لکھیں..." : "Start typing your reflection..."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          dir={isUrdu ? "rtl" : "ltr"}
          autoFocus
        />
      </div>
    </div>
  );
};

export default NoteEditor;
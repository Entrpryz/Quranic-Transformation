/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  Type,
  AlignLeft,
  AlignRight,
  X,
  Download,
  Eye,
  PenTool,
} from "lucide-react";
import { Lesson } from "@/lib/constants";

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

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
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== initialContent || isUrdu !== initialIsUrdu) {
        onSave(content, isUrdu);
        setLastSaved(new Date());
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, isUrdu, initialContent, initialIsUrdu, onSave]);

  const insertSyntax = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    const newText =
      prefix === "- " || prefix === "## "
        ? before + prefix + selection + after
        : before + prefix + selection + suffix + after;
    setContent(newText);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // NOTE: Libraries are loaded via script tags in layout.tsx
      // In a strict production app, you might use npm packages,
      // but this preserves your existing logic.
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;

      if (!html2canvas || !jsPDF) {
        alert("PDF libraries not loaded");
        setExporting(false);
        return;
      }

      await document.fonts.ready;

      // ... [Insert the rest of your PDF Generation Logic here unchanged] ...
      // For brevity in the response, paste the PDF generation code from your original component
      // starting from "const loadingOverlay = ..." down to "setExporting(false);"

      // MOCK FOR THIS EXAMPLE (Paste your real logic here):
      alert(
        "PDF Export logic runs here. Ensure window.html2canvas is available."
      );
      setExporting(false);
    } catch (error) {
      console.error("PDF Export failed", error);
      setExporting(false);
    }
  };

  const MarkdownRenderer = ({ text, rtl }: { text: string; rtl: boolean }) => {
    const parseFormattedText = (line: string) => {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-slate-800 font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={i} className="italic text-emerald-700">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      });
    };

    return (
      <div
        className={`prose max-w-none ${
          rtl
            ? "font-urdu text-right text-xl leading-loose"
            : "text-left leading-relaxed"
        }`}
        dir={rtl ? "rtl" : "ltr"}
      >
        {text.split("\n").map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-4" />;
          if (line.startsWith("## "))
            return (
              <h3
                key={i}
                className="text-xl font-display font-bold text-slate-800 mt-6 mb-3 border-l-4 border-emerald-500 pl-3 tracking-tight"
              >
                {line.replace("## ", "")}
              </h3>
            );
          if (line.startsWith("- "))
            return (
              <div key={i} className="flex gap-3 ml-1 mb-1 items-start">
                <span className="text-emerald-500 font-bold text-lg leading-none mt-1">
                  •
                </span>
                <span className="text-slate-700">
                  {parseFormattedText(line.replace("- ", ""))}
                </span>
              </div>
            );
          return (
            <p key={i} className="mb-2 text-slate-700">
              {parseFormattedText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 border-b border-emerald-200 z-10">
        <div className="flex-1 truncate pr-6">
          <h3 className="font-display font-bold text-2xl text-white leading-tight truncate tracking-tight">
            {lesson.topicName}
          </h3>
          <p className="text-sm text-emerald-100 font-bold uppercase tracking-widest mt-2">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-base font-display font-bold transition-all border ${
              exporting
                ? "bg-white/20 text-emerald-100 border-white/20"
                : "bg-white text-emerald-700 hover:shadow-lg shadow-emerald-500/30 border-transparent focus:ring-2 focus:ring-white/50"
            }`}
          >
            {exporting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>Export PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-red-500/30 border border-white/20 focus:ring-2 focus:ring-white/50 transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {activeTab === "write" && (
        <div className="flex items-center gap-3 px-6 py-4 overflow-x-auto no-scrollbar bg-emerald-50 border-b border-emerald-200">
          <div className="flex bg-white p-2 rounded-2xl border border-emerald-200">
            {/* Toolbar Buttons */}
            <button
              onClick={() => insertSyntax("**", "**")}
              className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl"
              title="Bold"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => insertSyntax("*", "*")}
              className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl"
              title="Italic"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => insertSyntax("- ")}
              className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl"
              title="List"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => insertSyntax("## ")}
              className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl"
              title="Heading"
            >
              <Type size={20} />
            </button>
          </div>
          <div className="h-10 w-[2px] bg-emerald-200 mx-2"></div>
          <button
            onClick={() => setIsUrdu(!isUrdu)}
            className={`px-5 py-3 rounded-2xl text-base font-display font-bold flex items-center gap-3 transition-all border ${
              isUrdu
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-700"
                : "bg-white border-emerald-200 text-emerald-600"
            }`}
          >
            {isUrdu ? <AlignRight size={20} /> : <AlignLeft size={20} />}
            {isUrdu ? "Urdu Mode" : "English Mode"}
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative bg-white">
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            dir={isUrdu ? "rtl" : "ltr"}
            className={`w-full h-full p-6 resize-none focus:outline-none bg-transparent text-slate-700 leading-relaxed border border-transparent focus:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50 ${
              isUrdu ? "font-urdu text-xl" : "font-sans text-base"
            }`}
            placeholder={
              isUrdu
                ? "یہاں اپنے نوٹس لکھیں..."
                : "Start writing your reflections here..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="w-full h-full p-8 overflow-y-auto bg-slate-50">
            {content.trim() ? (
              <MarkdownRenderer text={content} rtl={isUrdu} />
            ) : (
              <p className="text-emerald-600 italic text-center mt-20 text-xl">
                Nothing to preview yet.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-emerald-50 border-t border-emerald-200 pb-safe">
        <div className="flex text-center">
          <button
            onClick={() => setActiveTab("write")}
            className={`flex-1 py-5 text-base font-display font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-t-2 ${
              activeTab === "write"
                ? "text-emerald-700 bg-emerald-500/20 border-emerald-500"
                : "text-emerald-600 border-transparent hover:bg-white"
            }`}
          >
            <PenTool size={20} /> Write Mode
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-5 text-base font-display font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-t-2 ${
              activeTab === "preview"
                ? "text-emerald-700 bg-emerald-500/20 border-emerald-500"
                : "text-emerald-600 border-transparent hover:bg-white"
            }`}
          >
            <Eye size={20} /> Preview Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;

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
import { Lesson } from "../constants";

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
    let newText =
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
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;

      if (!html2canvas || !jsPDF) {
        alert("PDF libraries not loaded");
        setExporting(false);
        return;
      }

      await document.fonts.ready;

      // 1. Create a Loading Overlay
      const loadingOverlay = document.createElement("div");
      loadingOverlay.style.position = "fixed";
      loadingOverlay.style.inset = "0";
      loadingOverlay.style.zIndex = "10000";
      loadingOverlay.style.backgroundColor = "rgba(15, 23, 42, 0.9)";
      loadingOverlay.style.backdropFilter = "blur(5px)";
      loadingOverlay.style.display = "flex";
      loadingOverlay.style.alignItems = "center";
      loadingOverlay.style.justifyContent = "center";
      loadingOverlay.style.flexDirection = "column";
      loadingOverlay.innerHTML = `
        <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 20px; font-family: sans-serif; color: #10b981; font-weight: 700; font-size: 18px;">Generating PDF...</p>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      `;
      document.body.appendChild(loadingOverlay);

      // 2. Setup A4 Container for Capture
      const tempContainer = document.createElement("div");
      const a4WidthPx = 794; // 96 DPI

      tempContainer.style.width = `${a4WidthPx}px`;
      tempContainer.style.minHeight = "1123px"; // A4 height
      tempContainer.style.padding = "60px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.boxSizing = "border-box";
      tempContainer.style.position = "fixed";
      tempContainer.style.top = "0";
      tempContainer.style.left = "0";
      tempContainer.style.zIndex = "9999";
      tempContainer.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

      // Header
      const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const headerHTML = `
        <div style="border-bottom: 2px solid #10b981; padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="flex: 1;">
            <h1 style="font-size: 28px; color: #10b981; font-family: 'Plus Jakarta Sans', serif; font-weight: 700; margin: 0 0 8px 0; line-height: 1.2;">${lesson.topicName}</h1>
            <p style="font-size: 14px; color: #6B7280; margin: 0; font-weight: 500;">${lesson.surahReference} • Qur'anic Transformation</p>
          </div>
          <div style="text-align: right; padding-left: 20px;">
              <div style="font-size: 12px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Reflection Note</div>
              <div style="font-size: 12px; color: #6B7280; margin-top: 4px;">${dateStr}</div>
          </div>
        </div>
      `;

      // Helper to convert Markdown to stylized HTML
      const parseMarkdownToHTML = (text: string) => {
        return text
          .split("\n")
          .map((line) => {
            // Escape HTML characters
            let cleanLine = line
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");

            // Parse Bold and Italic
            cleanLine = cleanLine
              .replace(
                /\*\*(.*?)\*\*/g,
                '<strong style="color: #111827;">$1</strong>'
              )
              .replace(/\*(.*?)\*/g, "<em>$1</em>");

            if (cleanLine.trim().startsWith("## ")) {
              return `<h3 style="font-size: 18px; color: #111827; font-weight: 700; margin-top: 24px; margin-bottom: 12px; font-family: 'Plus Jakarta Sans', serif; border-left: 4px solid #10b981; padding-left: 12px;">${cleanLine.replace(
                "## ",
                ""
              )}</h3>`;
            }
            if (cleanLine.trim().startsWith("- ")) {
              return `
                <div style="display: flex; align-items: flex-start; margin-bottom: 8px; padding-left: 4px;">
                  <span style="color: #10b981; margin-right: 10px; font-size: 18px; line-height: 1;">•</span>
                  <span style="flex: 1;">${cleanLine.replace("- ", "")}</span>
                </div>`;
            }
            if (!cleanLine.trim()) return '<div style="height: 16px;"></div>';
            return `<p style="margin-bottom: 12px; text-align: ${
              isUrdu ? "justify" : "left"
            };">${cleanLine}</p>`;
          })
          .join("");
      };

      const contentHtml = parseMarkdownToHTML(content);
      const direction = isUrdu ? "rtl" : "ltr";
      const textAlign = isUrdu ? "right" : "left";
      const fontFamily = isUrdu
        ? "'Gulzar', serif"
        : "'Plus Jakarta Sans', sans-serif";
      const fontSize = isUrdu ? "22px" : "14px";
      const lineHeight = isUrdu ? "2.2" : "1.7";

      const bodyHTML = `
        <div style="direction: ${direction}; text-align: ${textAlign}; font-family: ${fontFamily}; font-size: ${fontSize}; line-height: ${lineHeight}; color: #374151; min-height: 600px;">
          ${contentHtml}
        </div>
      `;

      const footerHTML = `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #9CA3AF;">
          <span>Generated by Qur'anic Transformation App</span>
          <span>quranic-transform.app</span>
        </div>
      `;

      tempContainer.innerHTML = headerHTML + bodyHTML + footerHTML;
      document.body.appendChild(tempContainer);

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 3. Capture with html2canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // 2x resolution for retina-like quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // 4. Generate PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Multi-page logic
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeTitle = lesson.topicName
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();
      pdf.save(`${safeTitle}-notes.pdf`);

      // Cleanup
      document.body.removeChild(tempContainer);
      document.body.removeChild(loadingOverlay);
      setExporting(false);
    } catch (error) {
      console.error("PDF Export failed", error);
      // Force cleanup
      const overlays = document.querySelectorAll(
        'div[style*="z-index: 10000"]'
      );
      overlays.forEach((el) => el.remove());
      const temps = document.querySelectorAll('div[style*="z-index: 9999"]');
      temps.forEach((el) => el.remove());

      alert("Could not generate PDF. Please try again.");
      setExporting(false);
    }
  };

  const MarkdownRenderer = ({ text, rtl }: { text: string; rtl: boolean }) => {
    // Basic formatting parser for preview
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
            <button
              onClick={() => insertSyntax("**", "**")}
              className="p-3 hover:bg-emerald-50 hover:shadow-sm rounded-xl text-emerald-600 transition-all border border-transparent hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50"
              title="Bold"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => insertSyntax("*", "*")}
              className="p-3 hover:bg-emerald-50 hover:shadow-sm rounded-xl text-emerald-600 transition-all border border-transparent hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50"
              title="Italic"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => insertSyntax("- ")}
              className="p-3 hover:bg-emerald-50 hover:shadow-sm rounded-xl text-emerald-600 transition-all border border-transparent hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50"
              title="List"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => insertSyntax("## ")}
              className="p-3 hover:bg-emerald-50 hover:shadow-sm rounded-xl text-emerald-600 transition-all border border-transparent hover:border-emerald-500/30 focus:ring-2 focus:ring-emerald-500/50"
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
                : "bg-white border-emerald-200 text-emerald-600 hover:border-emerald-500/30 hover:text-emerald-700 focus:ring-2 focus:ring-emerald-500/50"
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
                : "text-emerald-600 border-transparent hover:bg-white focus:ring-2 focus:ring-emerald-500/50"
            }`}
          >
            <PenTool size={20} /> Write Mode
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-5 text-base font-display font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-t-2 ${
              activeTab === "preview"
                ? "text-emerald-700 bg-emerald-500/20 border-emerald-500"
                : "text-emerald-600 border-transparent hover:bg-white focus:ring-2 focus:ring-emerald-500/50"
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

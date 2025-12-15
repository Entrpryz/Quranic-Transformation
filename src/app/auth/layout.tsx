"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";

interface Verse {
  text: string;
  translation: string;
  surah: {
    englishName: string;
    number: number;
  };
  numberInSurah: number;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        setLoading(true);
        // Bust cache with timestamp
        const timestamp = new Date().getTime();
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.sahih?t=${timestamp}`
        );

        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }

        const data = await res.json();

        if (data.data) {
          const arabicData = data.data[0];
          const englishData = data.data[1];

          setVerse({
            text: arabicData.text,
            translation: englishData.text,
            surah: arabicData.surah,
            numberInSurah: arabicData.numberInSurah,
          });
        }
      } catch (error) {
        console.error("Failed to fetch verse:", error);
        // Fallback Verse
        setVerse({
          text: "رَّبِّ زِدْنِى عِلْمًا",
          translation: "My Lord, increase me in knowledge.",
          surah: { englishName: "Taha", number: 20 },
          numberInSurah: 114,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* --- LEFT COLUMN (Forms) --- */}
      <div className="relative order-2 lg:order-1 flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen z-20">
        {/* Mobile Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none lg:hidden" />

        {/* Mobile Header / Logo Placeholder */}
        <div className="lg:hidden mb-8 absolute top-8 left-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              IlmPlatform
            </span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] relative z-10">{children}</div>

        {/* Footer / Legal (Optional) */}
        <div className="absolute bottom-6 text-xs text-zinc-600 hidden lg:block">
          © {new Date().getFullYear()} Ilm Platform. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT COLUMN (Visuals & Verse) --- */}
      <div className="hidden lg:relative lg:flex h-full flex-col items-center justify-center p-12 order-1 lg:order-2 bg-zinc-900 border-l border-zinc-800/50 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Image.jpg" // Ensure this exists in public/
            alt="Islamic Architecture"
            fill
            className="object-cover opacity-30"
            priority
          />
          {/* Gradient to ensure text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/90 to-zinc-950/40" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-xl text-center space-y-10 min-h-[400px] flex flex-col justify-center px-4">
          {/* Decorative Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center backdrop-blur-md shadow-2xl shadow-emerald-500/10"
          >
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 text-zinc-500"
              >
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500/50" />
                <span className="text-sm uppercase tracking-[0.2em]">
                  Loading Wisdom...
                </span>
              </motion.div>
            ) : verse ? (
              <motion.blockquote
                key="verse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Arabic Text - CRITICAL: Keeping custom font class */}
                <p
                  className="text-4xl md:text-5xl font-quran text-emerald-100 leading-[2.2] dir-rtl drop-shadow-xl"
                  style={{ textShadow: "0 0 40px rgba(16, 185, 129, 0.3)" }}
                >
                  {verse.text}
                </p>

                {/* Divider */}
                <div className="w-16 h-1 bg-linear-to-r from-transparent via-emerald-500/50 to-transparent mx-auto rounded-full" />

                {/* English Translation */}
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl font-light text-zinc-300 leading-relaxed italic">
                    &quot;{verse.translation}&quot;
                  </p>

                  <footer className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-zinc-700/50 bg-zinc-800/30 text-xs font-medium tracking-widest uppercase text-emerald-500/80">
                    <span>Surah {verse.surah.englishName}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span>Verse {verse.numberInSurah}</span>
                  </footer>
                </div>
              </motion.blockquote>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
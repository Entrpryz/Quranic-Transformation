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
        // Fetches a random Ayah with Arabic (quran-uthmani) and English (en.sahih)
        const res = await fetch(
          "https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.sahih"
        );
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
        console.error("Failed to fetch verse", error);
        // Fallback if API fails
        setVerse({
          text: "رَّبِّ زِدْنِى عِلْمًا",
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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-zinc-950 overflow-hidden">
      {/* --- RIGHT COLUMN (Visuals) --- */}
      <div className="hidden lg:relative lg:flex h-full flex-col items-center justify-center p-12 order-2 bg-zinc-900 border-l border-zinc-800/50">
        {/* Abstract Background Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Image.jpg"
            alt="Islamic Architecture"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-lg text-center space-y-8 min-h-[300px] flex flex-col justify-center">
          {/* Floating Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]"
          >
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 text-zinc-500"
              >
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-gulzar tracking-widest">
                  Loading Divine Wisdom...
                </span>
              </motion.div>
            ) : verse ? (
              <motion.blockquote
                key="verse"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                {/* Arabic Text */}
                <p className="text-3xl md:text-4xl font-gulzar text-emerald-400/90 leading-relaxed dir-rtl drop-shadow-lg">
                  {verse.text}
                </p>

                {/* Divider */}
                <div className="w-24 h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent mx-auto" />

                {/* English Text */}
                <p className="text-xl md:text-2xl font-gulzar text-white/90 leading-relaxed italic">
                  &quot;{verse.translation}&quot;
                </p>

                <footer className="text-sm text-zinc-400 font-sans tracking-widest uppercase border-t border-zinc-800/50 inline-block pt-4 px-6">
                  Surah {verse.surah.englishName} ({verse.surah.number}:
                  {verse.numberInSurah})
                </footer>
              </motion.blockquote>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* --- LEFT COLUMN (Forms) --- */}
      <div className="relative flex flex-col items-center justify-center p-4 lg:p-8 min-h-screen order-1">
        {/* Mobile Ambient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none lg:hidden" />

        {/* Mobile Logo */}
        <div className="lg:hidden mb-8 absolute top-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={24}
              height={24}
              className="invert brightness-0"
            />
          </div>
        </div>

        <div className="w-full max-w-[400px] relative z-10">{children}</div>
      </div>
    </div>
  );
}

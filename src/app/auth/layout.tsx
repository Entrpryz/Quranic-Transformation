"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-zinc-950 overflow-hidden">
      {/* --- RIGHT COLUMN (Desktop Only - Visuals) --- 
          We place this first in code but order-2 in grid if we wanted right, 
          but usually Auth visuals are on Left or Right. Let's stick to Right for modern SaaS feel.
      */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 max-w-lg text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </div>

          <blockquote className="space-y-4">
            <p className="text-2xl font-gulzar text-white leading-relaxed">
              &quot;Read! In the name of your Lord who created: Created man from
              a clot. Read! And your Lord is the Most Generous.&quot;
            </p>
            <footer className="text-sm text-zinc-400 font-sans tracking-widest uppercase">
              Surah Al-Alaq (96:1-3)
            </footer>
          </blockquote>
        </motion.div>
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

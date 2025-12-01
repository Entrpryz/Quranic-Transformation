import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo - Optional: Can be placed here or inside individual cards */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={40}
              height={40}
              className="invert brightness-0"
            />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

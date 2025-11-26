import type { Metadata } from "next";
import { Inter, Gulzar } from "next/font/google";
import "./globals.css";

// Font Configuration
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const gulzar = Gulzar({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-gulzar",
});

export const metadata: Metadata = {
  title: "Quranic Transformation",
  description: "Journey through divine wisdom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${gulzar.variable}`}>
      <head>
        {/* Scripts for PDF Generation */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" />
      </head>
      <body className="bg-linear-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 font-sans antialiased">
        {/* Main Container with Islamic-inspired geometric border */}
        <div className="min-h-screen relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIiBmaWxsPSIjZDBlN2Q0IiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-40" />

          {/* Content Container */}
          <div className="relative z-10 max-w-md mx-auto min-h-screen bg-white/80 backdrop-blur-sm border-x border-slate-200/60 shadow-sm">
            {children}
          </div>

          {/* Decorative elements */}
          <div className="fixed top-0 left-0 w-32 h-32 bg-emerald-200/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="fixed bottom-0 right-0 w-48 h-48 bg-teal-200/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />
        </div>
      </body>
    </html>
  );
}
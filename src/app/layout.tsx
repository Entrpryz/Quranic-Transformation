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
      <body className="bg-slate-50 font-sans antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}
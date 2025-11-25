import type { Metadata } from "next";
import { Inter, Gulzar } from "next/font/google";
import "./globals.css";

// Font Configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const gulzar = Gulzar({
  weight: "400",
  subsets: ["arabic"],
  variable: "--font-gulzar",
  display: "swap",
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
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          async
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
          async
        />
      </head>
      <body className="bg-slate-50 font-sans antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}
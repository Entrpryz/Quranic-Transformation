import type { Metadata } from "next";
import { Inter, Gulzar, Amiri_Quran } from "next/font/google";
import "./globals.css";

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

const amiri = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-amiri",
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
    <html
      lang="en"
      className={`${inter.variable} ${gulzar.variable} ${amiri.variable} dark`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className="bg-background min-h-screen font-sans antialiased text-foreground overflow-x-hidden">
        {/* Main layout wrapper */}
        <div className="flex min-h-screen flex-col lg:flex-row relative">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#060b18",
};

export const metadata: Metadata = {
  title: "RecruitFlow AI",
  description: "AI Powered Resume Analyzer",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RecruitFlow AI",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        {/* Tactical Noise & Premium Background Glows */}
        <div className="noise-overlay" />
        <div className="glow-container">
          <div className="glow-blob glow-1" />
          <div className="glow-blob glow-2" />
        </div>
        <div className="grid-overlay" />

        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

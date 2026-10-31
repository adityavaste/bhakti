// app/layout.tsx
import "./globals.css";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import RadioPlayerDock from "@/components/darshan/RadioPlayerDock";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt"; // <-- Import prompt banner
import TopBar from "@/components/Top-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FF8A00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Divine Darshan — India's Digital Temple Platform",
  description: "Experience divine temple darshan and aarti online.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Divine Darshan",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D1609] antialiased`}
      >
        <AudioPlayerProvider>
        <ServiceWorkerRegister />
        <TopBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Floating PWA Install Banner */}
        <InstallPrompt />
        <RadioPlayerDock />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
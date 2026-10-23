// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // or your fonts
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister"; // if registering SW
import "./globals.css";
import TopBar from "@/components/Top-bar";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Divine Darshan — India's Digital Temple Platform",
  description: "Experience divine temple darshan and aarti online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D1609] antialiased`}>
        {/* Client-side logic runs inside client component wrappers */}
        <ServiceWorkerRegister />
        <TopBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />

        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
      </body>
    </html>
  );
}
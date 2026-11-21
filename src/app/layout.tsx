import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import NavigationSidebar from "@/components/layout/NavigationSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import BreakingNewsTicker from "@/components/news/BreakingNewsTicker";
import Footer from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "MENA CYBER WIRE | Regional Cyber Intelligence. Real-time Awareness.",
  description: "Independent cybersecurity news, threat intelligence, vulnerability monitoring, and community platform for the Middle East & North Africa (GCC, Levant, North Africa).",
  keywords: [
    "MENA cybersecurity",
    "Saudi Arabia cyber attack",
    "UAE cyber security",
    "NCA ECC",
    "aeCERT",
    "Q-CERT",
    "Middle East ransomware",
    "CISA advisories",
    "NVD CVE",
  ],
  authors: [{ name: "MENA Cyber Wire Editorial Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-ice text-slate-dark antialiased selection:bg-mist selection:text-teal">
        {/* Top Header */}
        <Header />

        {/* Breaking News Ticker Strip (Coastal Tech Style) */}
        <BreakingNewsTicker />

        {/* Main 3-Column Editorial Grid Container */}
        <div className="flex-1 w-full max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Navigation Sidebar (Desktop 3 cols) */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
              <NavigationSidebar />
            </aside>

            {/* Center Content Feed (Desktop 6 cols on 12-col grid, full on mobile/tablet) */}
            <main className="col-span-1 lg:col-span-6 w-full min-w-0 space-y-6">
              {children}
            </main>

            {/* Right Intelligence Sidebar (Desktop 3 cols) */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
              <RightSidebar />
            </aside>
          </div>
        </div>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Fixed Bottom Navigation (Mobile & Tablet) */}
        <MobileBottomNav />
      </body>
    </html>
  );
}

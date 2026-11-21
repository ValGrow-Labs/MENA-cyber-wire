import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Newsreader, Source_Sans_3, JetBrains_Mono } from "next/font/google";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });
import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";
import { themeInitScript } from "@/components/shared/ThemeToggle";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0D0E",
};

export const metadata: Metadata = {
  title: {
    default: "MENA Cyber Wire: cyber security news for the Middle East & North Africa",
    template: "%s · MENA Cyber Wire",
  },
  description:
    "Independent reporting on cyber attacks, vulnerabilities and policy across the GCC, Levant and North Africa, with links to every primary source.",
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
  openGraph: {
    title: "MENA Cyber Wire",
    description: "Cyber security news for the Middle East & North Africa.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230D0D0E' rx='7'/%3E%3Crect x='13' y='8' width='6' height='16' rx='1' fill='%23E52D27'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />

        <PageShell>{children}</PageShell>

        <Footer />
      </body>
    </html>
  );
}

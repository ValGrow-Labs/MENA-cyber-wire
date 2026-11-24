import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Newsreader, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { themeInitScript } from "@/components/shared/ThemeToggle";
import { CMS_DB } from "@/lib/cms/db";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";

const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", style: ["normal", "italic"], adjustFontFallback: false });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0D0E",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seo.defaultTitle || "MENA Cyber Wire: Cyber Security Intelligence for Middle East & North Africa",
      template: seo.titleTemplate || "%s · MENA Cyber Wire",
    },
    description:
      seo.defaultDescription ||
      "Independent reporting on cyber attacks, zero-days, ransomware, and national security directives across Saudi Arabia, UAE, Qatar, Egypt, and the MENA region.",
    keywords: seo.keywords || [],
    authors: [{ name: "MENA Cyber Wire Intelligence Desk", url: baseUrl }],
    creator: "MENA Cyber Wire",
    publisher: seo.publisherName || "MENA Cyber Wire",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: baseUrl,
      siteName: seo.publisherName || "MENA Cyber Wire",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "MENA Cyber Wire Intelligence Feed",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      creator: seo.twitterHandle || "@menacyberwire",
      images: [
        seo.defaultOgImage ||
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      ...(seo.googleSiteVerification ? { google: seo.googleSiteVerification } : {}),
      ...(seo.bingSiteVerification ? { other: { "msvalidate.01": seo.bingSiteVerification } } : {}),
    },
    icons: {
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230D0D0E' rx='7'/%3E%3Crect x='13' y='8' width='6' height='16' rx='1' fill='%23E52D27'/%3E%3C/svg%3E",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <OrganizationJsonLd
          name={seo.publisherName}
          url={baseUrl}
          logoUrl={seo.publisherLogoUrl}
          contactEmail={seo.contactEmail}
          socialLinks={Object.values(seo.socialProfiles || {})}
        />
        <WebSiteJsonLd
          name={seo.publisherName}
          url={baseUrl}
          description={seo.defaultDescription}
        />
        <GoogleAnalytics measurementId={seo.gaMeasurementId} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}

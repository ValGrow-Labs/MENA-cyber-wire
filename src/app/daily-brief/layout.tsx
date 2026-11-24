import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const pageMeta = seo.pageMetadata?.dailyBrief;

  const title = pageMeta?.title || "Daily Cyber Intelligence Brief & Defensive Telemetry | MENA Cyber Wire";
  const description =
    pageMeta?.description ||
    "Executive threat summary, daily regional risk level, sector-targeted advisories, and immediate defensive actions for CISOs and security analysts.";
  const keywords = pageMeta?.keywords || [
    "Daily Cyber Brief",
    "MENA Threat Level",
    "Executive Security Summary",
    "CISO Recommendations Middle East",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/daily-brief`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/daily-brief`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Daily Cyber Intelligence Brief",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: seo.twitterHandle || "@menacyberwire",
      images: [seo.defaultOgImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"],
    },
  };
}

export default function DailyBriefLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Daily Cyber Brief", item: `${baseUrl}/daily-brief` },
        ]}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const pageMeta = seo.pageMetadata?.breaking;

  const title = pageMeta?.title || "Breaking Cybersecurity News & Active Incident Wire | MENA Cyber Wire";
  const description =
    pageMeta?.description ||
    "Real-time updates on active cyber attacks, zero-day alerts, and emergency advisories impacting GCC and MENA organizations.";
  const keywords = pageMeta?.keywords || [
    "Breaking Cyber News",
    "Active Ransomware Middle East",
    "Emergency Cyber Advisory",
    "Zero-day alert MENA",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/breaking`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/breaking`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "Breaking Cyber Incidents Wire",
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

export default function BreakingLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Breaking Wire", item: `${baseUrl}/breaking` },
        ]}
      />
      {children}
    </>
  );
}

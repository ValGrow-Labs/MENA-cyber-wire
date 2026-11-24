import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);
  const pageMeta = seo.pageMetadata?.threats;

  const title = pageMeta?.title || "Vulnerability Intelligence & CISA KEV Exploits in MENA | MENA Cyber Wire";
  const description =
    pageMeta?.description ||
    "Continuous vulnerability tracking, NVD CVSS telemetry, actively exploited vulnerabilities in perimeter equipment (PAN-OS, Ivanti, FortiOS), and remediation guidance.";
  const keywords = pageMeta?.keywords || [
    "Vulnerability Intelligence",
    "CISA KEV",
    "NVD CVE",
    "Zero-day exploits Middle East",
    "Edge appliance vulnerability",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/threats`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/threats`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "MENA Vulnerabilities & KEV Telemetry",
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

export default function ThreatsLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Vulnerabilities & KEV", item: `${baseUrl}/threats` },
        ]}
      />
      {children}
    </>
  );
}

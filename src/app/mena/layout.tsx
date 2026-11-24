import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);
  const pageMeta = seo.pageMetadata?.mena;

  const title = pageMeta?.title || "Regional Cybersecurity Desks & Sovereign Regulatory Watch | MENA Cyber Wire";
  const description =
    pageMeta?.description ||
    "Country-by-country intelligence across 13 Middle East & North African nations, tracking sovereign CERTs, PDPL laws, and threat postures.";
  const keywords = pageMeta?.keywords || [
    "Middle East Country Desks",
    "Saudi Arabia Cybersecurity",
    "UAE Cyber Defense",
    "Qatar Cyber Law",
    "aeCERT alerts",
    "NCA ECC compliance",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/mena`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/mena`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "MENA Regional Cyber Desks",
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

export default function MenaLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Country Desks", item: `${baseUrl}/mena` },
        ]}
      />
      {children}
    </>
  );
}

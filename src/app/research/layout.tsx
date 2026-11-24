import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);
  const pageMeta = seo.pageMetadata?.research;

  const title = pageMeta?.title || "APT Threat Actor Profiles & Deep Cyber Espionage Research | MENA Cyber Wire";
  const description =
    pageMeta?.description ||
    "Detailed threat dossiers on state-sponsored APT groups (MuddyWater, Charming Kitten, OilRig, Sandworm) active in the Middle East, with TTPs, MITRE ATT&CK mappings, and IOCs.";
  const keywords = pageMeta?.keywords || [
    "APT Threat Actors",
    "Cyber Espionage Middle East",
    "MuddyWater IOCs",
    "OilRig TTPs",
    "State-sponsored cyber attacks",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/research`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/research`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "APT Threat Actor Research and MITRE Telemetry",
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

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Threat Research & APT Profiles", item: `${baseUrl}/research` },
        ]}
      />
      {children}
    </>
  );
}

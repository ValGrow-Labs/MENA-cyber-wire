import type { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const homeMeta = seo.pageMetadata?.home;

  const title = homeMeta?.title || "MENA Cyber Wire: Real-time Cyber Security Intelligence for Middle East & North Africa";
  const description =
    homeMeta?.description ||
    "Live cybersecurity telemetry, primary source reporting on regional ransomware campaigns, state-sponsored APT attacks, critical infrastructure threats, and regulatory directives across Saudi Arabia, UAE, Qatar, and North Africa.";
  const keywords = homeMeta?.keywords && homeMeta.keywords.length > 0 ? homeMeta.keywords : seo.keywords;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "MENA Cyber Wire Intelligence Front Page",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: seo.twitterHandle || "@menacyberwire",
      images: [
        seo.defaultOgImage ||
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  };
}

export default function HomePage() {
  return <HomeClient />;
}

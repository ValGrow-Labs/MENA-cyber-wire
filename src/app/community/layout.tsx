import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const pageMeta = seo.pageMetadata?.community;

  const title = pageMeta?.title || "Security Community & Practitioner Threat Exchange | MENA Cyber Wire";
  const description =
    pageMeta?.description ||
    "Vetted peer forum for MENA cybersecurity engineers, incident responders, and compliance officers sharing verified insights and threat mitigation.";
  const keywords = pageMeta?.keywords || [
    "Cybersecurity Community",
    "MENA InfoSec",
    "Threat Exchange",
    "Incident Responders Middle East",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/community`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/community`,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: seo.twitterHandle || "@menacyberwire",
    },
  };
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: `${baseUrl}/` },
          { name: "Practitioner Community", item: `${baseUrl}/community` },
        ]}
      />
      {children}
    </>
  );
}

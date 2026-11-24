import React from "react";

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logoUrl?: string;
  description?: string;
  socialLinks?: string[];
  contactEmail?: string;
}

export function OrganizationJsonLd({
  name = "MENA Cyber Wire",
  url = "https://mena-cyber-wire.vercel.app",
  logoUrl = "https://mena-cyber-wire.vercel.app/logo.png",
  description = "Regional Cyber Intelligence. Real-time Awareness. Independent reporting on attacks, vulnerabilities, and policy across the Middle East & North Africa.",
  socialLinks = [
    "https://twitter.com/menacyberwire",
    "https://linkedin.com/company/mena-cyber-wire",
    "https://t.me/menacyberwire",
  ],
  contactEmail = "editor@menacyberwire.com",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name,
    url,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 600,
      height: 60,
    },
    description,
    sameAs: socialLinks.filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      email: contactEmail,
      contactType: "editorial newsroom",
      availableLanguage: ["English", "Arabic"],
    },
    publishingPrinciples: `${url}/editorial-policy`,
    correctionsPolicy: `${url}/editorial-policy#corrections`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteJsonLd({
  name = "MENA Cyber Wire",
  url = "https://mena-cyber-wire.vercel.app",
  description = "Middle East and North Africa Cybersecurity News and Threat Intelligence",
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface NewsArticleSchemaProps {
  headline: string;
  canonicalUrl: string;
  datePublished: string;
  dateModified?: string;
  description: string;
  imageUrl?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogoUrl?: string;
  articleSection?: string;
  keywords?: string[];
  country?: string;
}

export function NewsArticleJsonLd({
  headline,
  canonicalUrl,
  datePublished,
  dateModified,
  description,
  imageUrl,
  authorName = "MENA Cyber Wire Intelligence Desk",
  publisherName = "MENA Cyber Wire",
  publisherLogoUrl = "https://mena-cyber-wire.vercel.app/logo.png",
  articleSection = "Cybersecurity",
  keywords = [],
  country,
}: NewsArticleSchemaProps) {
  const images = imageUrl
    ? [imageUrl]
    : ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"];

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    image: images,
    datePublished: new Date(datePublished || Date.now()).toISOString(),
    dateModified: new Date(dateModified || datePublished || Date.now()).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: "Senior Cybersecurity Correspondent",
      worksFor: {
        "@type": "Organization",
        name: publisherName,
      },
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: publisherName,
      logo: {
        "@type": "ImageObject",
        url: publisherLogoUrl,
      },
    },
    articleSection,
    keywords: keywords.join(", "),
    inLanguage: "en",
    ...(country ? { contentLocation: { "@type": "Place", name: country } } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PersonJsonLd({
  name,
  role = "Cybersecurity Intelligence Analyst",
  url,
}: {
  name: string;
  role?: string;
  url?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: "MENA Cyber Wire",
    },
    ...(url ? { url } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

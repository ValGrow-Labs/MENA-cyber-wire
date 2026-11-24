import type { Metadata } from "next";
import Link from "next/link";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Scale, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  return {
    title: "Editorial & Corrections Policy · MENA Cyber Wire",
    description:
      "Our editorial standards, verification guidelines, primary source attribution policy, and transparent corrections process for regional cybersecurity news.",
    alternates: {
      canonical: `${baseUrl}/editorial-policy`,
    },
    openGraph: {
      title: "Editorial & Corrections Policy · MENA Cyber Wire",
      description: "Transparency, verification standards, and corrections protocol.",
      url: `${baseUrl}/editorial-policy`,
    },
  };
}

export default function EditorialPolicyPage() {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  const breadcrumbs = [
    { name: "Home", item: `${baseUrl}/` },
    { name: "Editorial Policy", item: `${baseUrl}/editorial-policy` },
  ];

  return (
    <div className="max-w-page mx-auto space-y-12">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <header className="border-b-2 border-edge pb-8">
        <p className="kicker text-brand">Journalistic Standards & Verification</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Editorial & Corrections Policy
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-xl leading-relaxed text-ink-2">
          MENA Cyber Wire is committed to accuracy, non-partisanship, and complete transparency in reporting on cyber operations and vulnerabilities across the Middle East and North Africa.
        </p>
      </header>

      <section className="space-y-10 font-serif text-lg leading-relaxed text-ink-2 max-w-prose">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">1. Verification and Sourcing Standards</h2>
          <p className="mt-3">
            In cybersecurity reporting, unverified claims often cause unwarranted panic or misattribute incidents to incorrect threat actors. Our editorial staff requires corroborating evidence before elevating any incident to <strong>SIGNAL</strong> status.
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 font-sans text-base text-ink-2">
            <li><strong>Official Sovereign CERTs:</strong> National notices from Saudi NCA, aeCERT, Q-CERT, and regional regulators represent authoritative primary records.</li>
            <li><strong>Technical Forensics:</strong> Threat reports must include verifiable telemetry, SHA-256 hashes, C2 indicators, or CVE identifiers.</li>
            <li><strong>Dark Web Extortion Claims:</strong> When ransomware gangs claim victim compromises without independent corroboration, stories are clearly marked <strong>WATCH</strong> or <strong>UNVERIFIED</strong> to prevent premature speculation.</li>
          </ul>
        </div>

        <div className="border-t border-rule pt-6">
          <h2 className="font-serif text-2xl font-bold text-ink">2. Original Reporting & Attribution</h2>
          <p className="mt-3">
            MENA Cyber Wire gives clear, prominent attribution to the original discoverers, researchers, and reporting journalists of any threat intelligence. Every article provides direct, clickable links to primary bulletins, research whitepapers, and advisory feeds.
          </p>
        </div>

        <div id="corrections" className="border-t border-rule pt-6">
          <h2 className="font-serif text-2xl font-bold text-ink flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-brand" />
            3. Corrections Policy
          </h2>
          <p className="mt-3">
            When factual errors occur, we correct them promptly, clearly, and transparently. We do not stealth-edit stories.
          </p>
          <p className="mt-3">
            Any material correction will include an explicit editor&apos;s note at the top or foot of the article explaining what was changed, why, and the date and time of the modification.
          </p>
          <p className="mt-3">
            To report an error or request an editorial review, contact our desk at:{" "}
            <a href={`mailto:${seo.contactEmail || "editor@menacyberwire.com"}`} className="font-semibold text-brand underline font-sans text-base">
              {seo.contactEmail || "editor@menacyberwire.com"}
            </a>
          </p>
        </div>

        <div className="border-t border-rule pt-6">
          <h2 className="font-serif text-2xl font-bold text-ink">4. Responsible Vulnerability Disclosure</h2>
          <p className="mt-3">
            We support responsible vulnerability disclosure. We do not publish exploit code for unpatched zero-days that could jeopardize critical infrastructure or human life. When reporting on active zero-days, our focus is strictly defensive: detection indicators, workarounds, and patch availability.
          </p>
        </div>
      </section>
    </div>
  );
}

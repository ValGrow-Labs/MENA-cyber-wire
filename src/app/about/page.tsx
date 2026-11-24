import type { Metadata } from "next";
import Link from "next/link";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Shield, Eye, Award, CheckCircle, Globe } from "lucide-react";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);

  return {
    title: "About MENA Cyber Wire · Regional Cyber Intelligence Desk",
    description:
      "About MENA Cyber Wire: Independent editorial reporting on cybersecurity, sovereign CERT directives, and critical infrastructure threats across the Middle East & North Africa.",
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    openGraph: {
      title: "About MENA Cyber Wire",
      description: "Regional Cyber Intelligence. Real-time Awareness.",
      url: `${baseUrl}/about`,
    },
  };
}

export default function AboutPage() {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);

  const breadcrumbs = [
    { name: "Home", item: `${baseUrl}/` },
    { name: "About Us", item: `${baseUrl}/about` },
  ];

  return (
    <div className="max-w-page mx-auto space-y-12">
      <BreadcrumbJsonLd items={breadcrumbs} />

      <header className="border-b-2 border-edge pb-8">
        <p className="kicker text-brand">Editorial Independence & Mission</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          About MENA Cyber Wire
        </h1>
        <p className="mt-4 max-w-3xl font-serif text-xl leading-relaxed text-ink-2">
          Independent reporting on attacks, vulnerabilities, and national cybersecurity policy across the GCC, Levant, and North Africa. Every story links to its verified primary source.
        </p>
      </header>

      <section className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8 font-serif text-lg leading-relaxed text-ink-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">Our Editorial Mandate</h2>
            <p className="mt-3">
              MENA Cyber Wire was founded to deliver timely, verified, non-sensational threat intelligence tailored specifically to the regional risk landscape of the Middle East and North Africa.
            </p>
            <p className="mt-3">
              Too often, global cybersecurity reporting either overlooks the nuanced threat vectors confronting Gulf energy grids, North African financial infrastructure, and Levant telecommunications, or aggregates unverified rumors from dark web chat rooms without technical substantiation.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">Zero AI Slop. Grounded in Primary Sources.</h2>
            <p className="mt-3">
              Our newsroom adheres to a strict editorial charter: zero unverified automated content. Every intelligence dispatch published on our wire is corroborated against primary sources—including national CERT advisories (aeCERT, Saudi NCA, Q-CERT, EG-CERT), NVD CVSS telemetry, vendor security bulletins, and verified incident responder forensic logs.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">Regional Coverage Scope</h2>
            <p className="mt-3">
              We operate continuous editorial desks monitoring thirteen sovereign jurisdictions across three sub-regions:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1 font-sans text-base text-ink-2">
              <li><strong>The Gulf:</strong> Saudi Arabia, United Arab Emirates, Qatar, Bahrain, Kuwait, Oman.</li>
              <li><strong>The Levant:</strong> Jordan, Lebanon, Iraq.</li>
              <li><strong>North Africa:</strong> Egypt, Morocco, Tunisia, Algeria.</li>
            </ul>
          </div>

          <div className="border-t border-rule pt-6">
            <h2 className="font-serif text-2xl font-bold text-ink">Editorial Leadership & Contact</h2>
            <p className="mt-3">
              Our intelligence desk is headed by Senior Cyber Desk Editors and regional intelligence correspondents. We maintain strict separation between editorial reporting and commercial partnerships.
            </p>
            <p className="mt-3 font-sans text-sm text-ink-3">
              Direct editorial tips and inquiries:{" "}
              <a href={`mailto:${seo.contactEmail || "editor@menacyberwire.com"}`} className="font-semibold text-brand underline">
                {seo.contactEmail || "editor@menacyberwire.com"}
              </a>
            </p>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-xl border border-rule bg-paper-sunk p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand uppercase tracking-wider">
              <Shield className="h-4 w-4" />
              Core Newsroom Principles
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">Direct Primary Sourcing</strong>
                  <p className="text-xs text-ink-3 mt-0.5">Every dispatch links to official advisory feeds, CVE registries, or forensic disclosures.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">Verification Hierarchy</strong>
                  <p className="text-xs text-ink-3 mt-0.5">Categorized by verified SIGNAL, active WATCH, or UNVERIFIED dark web claims.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink">Actionable Defense</strong>
                  <p className="text-xs text-ink-3 mt-0.5">Each critical threat report features actionable guidance for regional SOCs and CISOs.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-rule pt-4">
              <Link href="/editorial-policy" className="btn-secondary text-xs w-full text-center block">
                Read Full Editorial & Corrections Policy →
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

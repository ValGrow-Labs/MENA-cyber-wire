import type { Metadata } from "next";
import { CMS_DB } from "@/lib/cms/db";

export const metadata: Metadata = { title: "Research" };
export const dynamic = "force-dynamic";

const IN_PROGRESS = [
  {
    kind: "Planned · OT / ICS",
    title: "What TRITON changed for safety systems at Gulf industrial plants",
    dek: "A look at how operators separate safety controllers from control and corporate networks. Not yet published.",
  },
  {
    kind: "Planned · Regulation",
    title: "A side-by-side guide to data protection laws across the GCC, Egypt and Morocco",
    dek: "Scope, breach notification and cross-border transfer rules, with links to the official texts. Not yet published.",
  },
];

export default function ResearchPage() {
  const threatActors = CMS_DB.getThreatActors().filter((a) => a.publicationStatus === "Published");

  return (
    <div className="space-y-14">
      <header>
        <p className="kicker">Research</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
          Groups behind major attacks on the region
        </h1>
        <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
          Profiles built only from public reporting by governments and security researchers. We list what is on the record, not speculation.
        </p>
      </header>

      <section aria-labelledby="actors">
        <div className="section-head">
          <h2 id="actors" className="section-title">Threat actor profiles</h2>
          <span className="text-xs font-medium text-ink-3 tabular">{threatActors.length} groups</span>
        </div>

        <div>
          {threatActors.map((a, i) => (
            <article key={a.id || a.name} className="grid gap-x-8 gap-y-3 border-t border-rule py-7 first:border-t-0 md:grid-cols-12">
              <div className="md:col-span-4">
                <span className="font-mono text-2xs text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink">{a.name}</h3>
                <p className="mt-1 text-sm text-ink-3">{a.aliases}</p>
                <p className="tag mt-3 border border-edge px-1.5 py-0.5 text-ink">{a.origin}</p>
              </div>
              <dl className="space-y-4 text-[0.9375rem] leading-relaxed md:col-span-8">
                <div>
                  <dt className="kicker">Targets</dt>
                  <dd className="mt-1 text-ink-2">{(a.targetSectors || []).join(", ") || a.description}</dd>
                </div>
                <div>
                  <dt className="kicker">Techniques & Threat Profile</dt>
                  <dd className="mt-1 text-ink-2">{a.threatProfile || (a.techniques || []).join(", ")}</dd>
                </div>
                <div className="border-l-2 border-edge pl-4">
                  <dt className="kicker text-ink">On the record</dt>
                  <dd className="mt-1 text-ink">{a.description}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="forthcoming">
        <div className="section-head">
          <h2 id="forthcoming" className="section-title">Planned research</h2>
        </div>
        <ul>
          {IN_PROGRESS.map((r) => (
            <li key={r.title} className="border-t border-rule py-5 first:border-t-0">
              <p className="kicker">{r.kind}</p>
              <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-ink">{r.title}</h3>
              <p className="mt-1.5 text-ink-2">{r.dek}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

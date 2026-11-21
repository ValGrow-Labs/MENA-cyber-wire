import type { Metadata } from "next";

export const metadata: Metadata = { title: "Research" };

const ACTORS = [
  {
    name: "MuddyWater",
    aliases: "Mango Sandstorm, Seedworm, Static Kitten, MERCURY",
    origin: "Iranian state",
    targets:
      "Government and private-sector organisations in telecoms, defence, local government and oil and gas, in the Middle East and beyond.",
    techniques:
      "Spear-phishing, exploitation of publicly known vulnerabilities, open-source tools and legitimate remote-administration software. Malware families named in public reporting include POWERSTATS, PowGoop and Small Sieve.",
    activity:
      "In January 2022 US Cyber Command identified MuddyWater as a subordinate element of Iran's Ministry of Intelligence and Security (MOIS). A joint advisory from CISA, the FBI, US Cyber Command's Cyber National Mission Force and the UK's NCSC followed in February 2022 (AA22-055A).",
  },
  {
    name: "OilRig",
    aliases: "APT34, Helix Kitten, Hazel Sandstorm",
    origin: "Iran-linked",
    targets:
      "Government, financial, energy, chemical and telecoms organisations, mostly in the Middle East; publicly tracked since at least 2014.",
    techniques:
      "Spear-phishing and social engineering, including fake recruiter approaches on LinkedIn reported in 2019; custom backdoors that use DNS for command and control, and web shells on internet-facing servers.",
    activity:
      "In 2019 a Telegram channel leaked what it said were OilRig tools, server details and victim data, giving researchers an unusually detailed view of the group's operations.",
  },
  {
    name: "Shamoon (Disttrack) operators",
    aliases: "Wiper campaigns of 2012, 2016-17 and 2018",
    origin: "Widely attributed to Iran-linked operators",
    targets: "Energy companies and government agencies, chiefly in Saudi Arabia.",
    techniques:
      "Destructive malware that overwrites files and the master boot record, rendering machines unbootable. Each wave spread internally using stolen credentials.",
    activity:
      "In August 2012 Shamoon wiped around 30,000 workstations at Saudi Aramco. New variants hit Saudi government organisations in late 2016 and early 2017, and the Italian oil services company Saipem, including its Middle East operations, in December 2018.",
  },
  {
    name: "TRITON / TRISIS",
    aliases: "Operators tracked as XENOTIME by Dragos",
    origin: "Linked by FireEye and the US Treasury to a Russian state research institute",
    targets: "Safety instrumented systems in industrial plants.",
    techniques:
      "Malware built to reprogram Schneider Electric Triconex safety controllers, the systems that shut a plant down safely when conditions become dangerous.",
    activity:
      "Discovered in 2017 at a petrochemical facility in Saudi Arabia after it tripped a safety shutdown. In October 2020 the US Treasury sanctioned Russia's Central Scientific Research Institute of Chemistry and Mechanics (TsNIIKhM) over its role.",
  },
];

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
  return (
    <div className="space-y-14">
      <header>
        <p className="kicker">Research</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">Groups behind major attacks on the region</h1>
        <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
          Profiles built only from public reporting by governments and security researchers. We list what is on the record, not speculation.
        </p>
      </header>

      <section aria-labelledby="actors">
        <div className="section-head">
          <h2 id="actors" className="section-title">Threat actor profiles</h2>
          <span className="text-xs font-medium text-ink-3 tabular">{ACTORS.length} groups</span>
        </div>

        <div>
          {ACTORS.map((a, i) => (
            <article key={a.name} className="grid gap-x-8 gap-y-3 border-t border-rule py-7 first:border-t-0 md:grid-cols-12">
              <div className="md:col-span-4">
                <span className="font-mono text-2xs text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink">{a.name}</h3>
                <p className="mt-1 text-sm text-ink-3">{a.aliases}</p>
                <p className="tag mt-3 border border-edge px-1.5 py-0.5 text-ink">{a.origin}</p>
              </div>
              <dl className="space-y-4 text-[0.9375rem] leading-relaxed md:col-span-8">
                <div>
                  <dt className="kicker">Targets</dt>
                  <dd className="mt-1 text-ink-2">{a.targets}</dd>
                </div>
                <div>
                  <dt className="kicker">Techniques</dt>
                  <dd className="mt-1 text-ink-2">{a.techniques}</dd>
                </div>
                <div className="border-l-2 border-edge pl-4">
                  <dt className="kicker text-ink">On the record</dt>
                  <dd className="mt-1 text-ink">{a.activity}</dd>
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

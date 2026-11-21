import Link from "next/link";
import BrandLogo from "@/components/shared/BrandLogo";

const DESKS = [
  { label: "Saudi Arabia", href: "/mena?country=SA" },
  { label: "United Arab Emirates", href: "/mena?country=AE" },
  { label: "Qatar", href: "/mena?country=QA" },
  { label: "Egypt", href: "/mena?country=EG" },
  { label: "Jordan", href: "/mena?country=JO" },
  { label: "All 13 countries", href: "/mena" },
];

const SECTIONS = [
  { label: "Breaking", href: "/breaking" },
  { label: "Vulnerabilities", href: "/threats" },
  { label: "Daily brief", href: "/daily-brief" },
  { label: "Research", href: "/research" },
  { label: "Community", href: "/community" },
  { label: "Saved", href: "/saved" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t-2 border-edge">
      <div className="mx-auto max-w-page px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandLogo size="md" showTagline={false} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">
              Independent reporting on attacks, vulnerabilities and policy across the Middle East and North Africa.
              Every story links to its primary source.
            </p>
          </div>

          <nav aria-label="Country desks" className="md:col-span-3 md:col-start-7">
            <p className="kicker">Country desks</p>
            <ul className="mt-3 space-y-2 text-sm">
              {DESKS.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="text-ink-2 hover:text-ink">{d.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Sections" className="md:col-span-3">
            <p className="kicker">Sections</p>
            <ul className="mt-3 space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-ink-2 hover:text-ink">{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-5 text-xs font-medium text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} MENA Cyber Wire</span>
          <span>Sources: Google News RSS · NVD API 2.0 · CISA KEV</span>
        </div>
      </div>
    </footer>
  );
}

import { CVEItem } from "@/types/threat";

interface Props {
  cve: CVEItem;
}

/** One row of the vulnerability table: ID · description/product · CVSS · date. */
export default function CVECard({ cve }: Props) {
  const isCritical = cve.severity === "CRITICAL";
  const isHigh = cve.severity === "HIGH";
  const date = new Date(cve.publishedDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const products = cve.affectedSoftware?.filter(Boolean) ?? [];

  return (
    <article className="group grid grid-cols-[1fr_auto] gap-x-5 gap-y-2 border-t border-rule py-4 sm:grid-cols-[10.5rem_1fr_4.5rem_6.5rem]">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:block">
        <a
          href={cve.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          {cve.id}
        </a>
        {cve.isExploitedInWild && (
          <span className="tag text-signal sm:mt-1.5 sm:flex">
            <span className="h-1.5 w-1.5 bg-signal" aria-hidden />
            Known exploited
          </span>
        )}
      </div>

      <div className="col-span-2 row-start-2 min-w-0 sm:col-span-1 sm:row-start-auto">
        <p className="text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-3">{cve.description}</p>
        <p className="mt-1.5 text-xs font-medium text-ink-3">
          {products.length > 0 ? products.join(" · ") : "Product listed on NVD"}
        </p>
        {cve.menaImpactNote && (
          <p className="mt-2 border-l-2 border-edge pl-3 text-sm leading-relaxed text-ink-2">
            <span className="kicker mr-2 text-ink">Regional note</span>
            {cve.menaImpactNote}
          </p>
        )}
      </div>

      <div className="col-start-2 row-start-1 text-right sm:col-start-auto sm:row-start-auto sm:text-left">
        <span
          className={`block font-mono text-lg font-medium leading-none tabular ${
            isCritical ? "text-signal" : isHigh ? "text-caution" : "text-ink"
          }`}
        >
          {cve.cvssScore.toFixed(1)}
        </span>
        <span className="mt-1 block text-xs font-medium text-ink-3">{cve.severity.toLowerCase()}</span>
      </div>

      <time dateTime={cve.publishedDate} className="hidden font-mono text-xs text-ink-3 tabular sm:block">
        {date}
      </time>
    </article>
  );
}

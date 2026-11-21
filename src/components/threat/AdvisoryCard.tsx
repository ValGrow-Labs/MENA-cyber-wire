import { CISAAdvisory } from "@/types/threat";

interface Props {
  advisory: CISAAdvisory;
}

export default function AdvisoryCard({ advisory }: Props) {
  const date = new Date(advisory.publishedDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const urgent = advisory.severity === "Critical";

  return (
    <article className="grid gap-x-5 border-t border-rule py-6 sm:grid-cols-[10.5rem_1fr]">
      <div className="mb-2 text-xs font-medium text-ink-3 sm:mb-0">
        <span className="block text-ink">{advisory.source}</span>
        <span className="block">{advisory.id}</span>
        <time dateTime={advisory.publishedDate} className="block tabular">{date}</time>
        <span className={`mt-2 block ${urgent ? "text-signal" : ""}`}>{advisory.severity}</span>
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-xl font-semibold leading-snug tracking-[-0.01em] text-ink">
          <a href={advisory.sourceUrl} target="_blank" rel="noopener noreferrer" className="decoration-1 underline-offset-[5px] hover:underline">
            {advisory.title}
          </a>
        </h3>
        <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">{advisory.summary}</p>

        {advisory.remediationAction && (
          <p className="mt-3 max-w-prose border-l-2 border-edge pl-3 text-sm leading-relaxed text-ink-2">
            <span className="kicker mr-2 text-ink">What to do</span>
            {advisory.remediationAction}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          {advisory.cveList?.map((id) => (
            <span key={id} className="font-mono text-2xs text-ink-3">{id}</span>
          ))}
          <a
            href={advisory.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link ml-auto text-sm text-ink"
          >
            Read the advisory ↗
          </a>
        </div>
      </div>
    </article>
  );
}

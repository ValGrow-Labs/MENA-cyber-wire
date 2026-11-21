import { CISAAdvisory } from "@/types/threat";
import { ExternalLink, ShieldCheck } from "lucide-react";

interface Props {
  advisory: CISAAdvisory;
}

export default function AdvisoryCard({ advisory }: Props) {
  const formattedDate = new Date(advisory.publishedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-border hover:border-teal/50 hover:shadow-coastal transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-border">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-alert-orange bg-alert-light px-2 py-0.5 rounded-md border border-alert-border">
            {advisory.id}
          </span>
          <span className="text-xs text-slate-muted">&middot;</span>
          <span className="text-xs font-bold text-ocean">
            {advisory.source}
          </span>
        </div>

        <span className="text-xs text-slate-muted font-mono">
          {formattedDate}
        </span>
      </div>

      <h3 className="mt-2.5 text-sm sm:text-base font-bold text-ocean leading-snug">
        {advisory.title}
      </h3>

      <p className="mt-2 text-xs sm:text-sm text-slate-dark leading-relaxed">
        {advisory.summary}
      </p>

      {/* Remediation Note */}
      <div className="mt-3 p-3 rounded-xl bg-mist/60 border border-mist-border text-xs">
        <span className="font-bold text-ocean flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal" />
          Required Defensive Action:
        </span>
        <p className="text-slate-dark text-[11px]">
          {advisory.remediationAction}
        </p>
      </div>

      {/* Action link */}
      <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {advisory.cveList && advisory.cveList.map((cve) => (
            <span key={cve} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-ice border border-slate-border text-ocean font-semibold">
              {cve}
            </span>
          ))}
        </div>

        <a
          href={advisory.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-bold text-teal hover:underline"
        >
          <span>Official Advisory Notice</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

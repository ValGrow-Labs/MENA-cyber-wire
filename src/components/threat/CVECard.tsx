import { CVEItem } from "@/types/threat";
import { ExternalLink, ShieldAlert, Cpu, AlertCircle } from "lucide-react";

interface Props {
  cve: CVEItem;
}

export default function CVECard({ cve }: Props) {
  // Coastal Tech severity colors:
  // Critical: Alert Orange
  // High: Amber
  // Medium: Ocean Blue
  // Low: Muted Slate
  const isCritical = cve.severity === "CRITICAL";
  const isHigh = cve.severity === "HIGH";

  const formattedDate = new Date(cve.publishedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-border hover:border-teal/50 hover:shadow-coastal transition-all">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-border">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm sm:text-base font-bold text-ocean">
            {cve.id}
          </span>
          {cve.isExploitedInWild && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md bg-alert-light text-alert-orange border border-alert-border flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>Actively Exploited</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-muted font-medium">
            CVSS v3.1:
          </span>
          <span
            className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-lg ${
              isCritical
                ? "bg-alert-orange text-white"
                : isHigh
                ? "bg-amber-light text-amber-dark border border-amber-border"
                : "bg-mist text-ocean border border-mist-border"
            }`}
          >
            {cve.cvssScore.toFixed(1)} {cve.severity}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-xs sm:text-sm text-slate-dark leading-relaxed">
        {cve.description}
      </p>

      {/* MENA Impact Note */}
      {cve.menaImpactNote && (
        <div className="mt-3 p-3 rounded-xl bg-mist/60 border border-mist-border text-xs">
          <span className="font-bold text-teal block mb-1">
            Regional Threat Impact:
          </span>
          <p className="text-slate-dark text-[11px]">
            {cve.menaImpactNote}
          </p>
        </div>
      )}

      {/* Affected Systems & Date */}
      <div className="mt-4 pt-3 border-t border-slate-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Cpu className="w-3.5 h-3.5 text-teal" />
          <span className="text-slate-muted font-medium">Affected:</span>
          {cve.affectedSoftware && cve.affectedSoftware.length > 0 ? (
            cve.affectedSoftware.map((sw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] font-mono rounded-md bg-ice border border-slate-border text-ocean font-medium"
              >
                {sw}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-muted">See NVD advisory</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-muted font-mono">
            {formattedDate}
          </span>
          <a
            href={cve.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-teal hover:underline"
          >
            <span>Official NVD</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

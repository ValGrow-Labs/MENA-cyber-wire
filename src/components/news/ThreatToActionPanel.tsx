import { ThreatToAction } from "@/types/news";
import { ShieldCheck, AlertCircle, Users, CheckCircle, ArrowRight } from "lucide-react";

interface Props {
  action: ThreatToAction;
  compact?: boolean;
}

export default function ThreatToActionPanel({ action, compact = false }: Props) {
  if (!action) return null;

  return (
    <div className="mt-3.5 p-4 rounded-xl bg-mist/70 border border-mist-border text-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-mist-border">
        <div className="p-1 rounded-md bg-teal text-white">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-extrabold uppercase tracking-wider text-[11px] text-ocean">
          Threat-to-Action Protocol
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
        {/* IMPACT: What could be affected? */}
        <div className="p-3 rounded-lg bg-white border border-slate-border shadow-2xs space-y-1">
          <span className="font-bold text-ocean flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-alert-orange" />
            IMPACT (Why it matters):
          </span>
          <p className="text-slate-dark text-[11px] pl-3.5">
            {action.whyItMatters}
          </p>
        </div>

        {/* ACTION: What should users or organizations do? */}
        <div className="p-3 rounded-lg bg-white border border-slate-border shadow-2xs space-y-1">
          <span className="font-bold text-ocean flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal" />
            ACTION (Defensive Steps):
          </span>
          <p className="text-slate-dark text-[11px] pl-3.5">
            {action.whatShouldUsersDo}
          </p>
        </div>

        {/* AFFECTED: Who should pay attention? */}
        <div className="p-3 rounded-lg bg-white border border-slate-border shadow-2xs space-y-1">
          <span className="font-bold text-ocean flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-desert" />
            AFFECTED (Target Scope):
          </span>
          <p className="text-slate-dark text-[11px] pl-3.5">
            {action.whoIsAffected}
          </p>
        </div>
      </div>

      {/* Bulleted defensive checklist */}
      {action.recommendedDefensiveActions && action.recommendedDefensiveActions.length > 0 && !compact && (
        <div className="mt-3.5 pt-3 border-t border-mist-border">
          <span className="font-bold text-[11px] uppercase tracking-wider text-ocean block mb-2">
            Technical Remediation Actions:
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0.5">
            {action.recommendedDefensiveActions.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-[11px] text-slate-dark p-2 rounded-lg bg-white/80 border border-slate-border/60">
                <CheckCircle className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

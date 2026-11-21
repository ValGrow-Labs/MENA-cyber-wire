import { ThreatToAction } from "@/types/news";

interface Props {
  action: ThreatToAction;
  compact?: boolean;
}

/** "Key points", three short columns divided by rules, then a numbered checklist. */
export default function ThreatToActionPanel({ action, compact = false }: Props) {
  if (!action) return null;

  const cols = [
    { label: "Why it matters", body: action.whyItMatters },
    { label: "Who is affected", body: action.whoIsAffected },
    { label: "What to do", body: action.whatShouldUsersDo },
  ];

  return (
    <div className="mt-4 border-y border-rule bg-paper-raised/60">
      <div className="grid divide-y divide-rule sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {cols.map((c) => (
          <div key={c.label} className="px-4 py-4 first:pl-4 sm:first:pl-0 sm:px-5">
            <p className="kicker text-ink">{c.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.body}</p>
          </div>
        ))}
      </div>

      {!compact && action.recommendedDefensiveActions?.length > 0 && (
        <div className="border-t border-rule px-4 py-4 sm:px-0">
          <p className="kicker text-ink">Recommended steps</p>
          <ol className="mt-3 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {action.recommendedDefensiveActions.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm leading-snug text-ink-2">
                <span className="font-mono text-2xs leading-5 text-signal tabular">{String(i + 1).padStart(2, "0")}</span>
                <span>{rec}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

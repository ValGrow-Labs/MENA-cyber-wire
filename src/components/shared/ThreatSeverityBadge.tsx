import { ThreatSeverity } from "@/types/news";

interface Props {
  severity: ThreatSeverity;
  size?: "sm" | "md";
}

/**
 * Severity as a 4-step bar meter + label. Only Critical uses the signal colour.
 */
export default function ThreatSeverityBadge({ severity, size = "md" }: Props) {
  const levels: Record<ThreatSeverity, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const level = levels[severity] ?? 2;
  const isCritical = severity === "Critical";

  return (
    <span
      className={`tag ${isCritical ? "text-signal" : severity === "High" ? "text-caution" : "text-ink-3"}`}
      title={`Severity: ${severity}`}
    >
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`w-[3px] ${i <= level ? "bg-current" : "bg-rule"}`}
            style={{ height: `${(size === "sm" ? 3 : 4) + i * 2}px` }}
          />
        ))}
      </span>
      <span>{severity}</span>
    </span>
  );
}

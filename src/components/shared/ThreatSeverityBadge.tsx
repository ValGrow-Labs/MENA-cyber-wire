import { ThreatSeverity } from "@/types/news";

interface Props {
  severity: ThreatSeverity;
  size?: "sm" | "md";
}

export default function ThreatSeverityBadge({ severity, size = "md" }: Props) {
  // Coastal Tech severity tokens:
  // Critical: Alert Orange
  // High: Desert Amber
  // Medium: Ocean Blue
  // Low: Muted Slate
  const styles: Record<ThreatSeverity, string> = {
    Critical: "bg-alert-light text-alert-orange border-alert-border font-bold",
    High: "bg-amber-light text-amber-dark border-amber-border font-semibold",
    Medium: "bg-mist text-ocean border-mist-border font-semibold",
    Low: "bg-slate-subtle text-slate-muted border-slate-border font-medium",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[9px] tracking-wide",
    md: "px-2.5 py-0.5 text-[10px] tracking-wider",
  };

  return (
    <span
      className={`inline-flex items-center uppercase rounded-md border ${styles[severity] || styles.Medium} ${sizes[size]}`}
    >
      {severity}
    </span>
  );
}

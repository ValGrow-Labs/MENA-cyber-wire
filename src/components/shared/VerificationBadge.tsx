import { VerificationStatus } from "@/types/news";
import { CheckCircle2, Eye, HelpCircle } from "lucide-react";

interface Props {
  status: VerificationStatus;
  size?: "sm" | "md";
}

export default function VerificationBadge({ status, size = "md" }: Props) {
  const configs: Record<VerificationStatus, { label: string; icon: any; className: string }> = {
    SIGNAL: {
      label: "SIGNAL",
      icon: CheckCircle2,
      className: "bg-teal-light text-teal border border-teal-border font-bold",
    },
    WATCH: {
      label: "WATCH",
      icon: Eye,
      className: "bg-amber-light text-amber-dark border border-amber-border font-bold",
    },
    UNVERIFIED: {
      label: "UNVERIFIED",
      icon: HelpCircle,
      className: "bg-slate-subtle text-slate-muted border border-slate-border font-semibold",
    },
  };

  const current = configs[status] || configs.SIGNAL;
  const Icon = current.icon;

  const sizes = {
    sm: "px-1.5 py-0.5 text-[9px] gap-1",
    md: "px-2 py-0.5 text-[10px] gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md uppercase tracking-wider ${current.className} ${sizes[size]}`}
      title={
        status === "SIGNAL"
          ? "Verified editorial intelligence with corroborated technical indicators"
          : status === "WATCH"
          ? "Developing threat actively tracked by regional SOC analysts"
          : "Claims or leak notices awaiting technical confirmation"
      }
    >
      <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      <span>{current.label}</span>
    </span>
  );
}

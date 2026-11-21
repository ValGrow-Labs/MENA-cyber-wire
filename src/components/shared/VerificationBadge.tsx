import { VerificationStatus } from "@/types/news";

interface Props {
  status: VerificationStatus;
  size?: "sm" | "md";
}

const CONFIG: Record<VerificationStatus, { label: string; mark: string; title: string; className: string }> = {
  SIGNAL: {
    label: "Confirmed",
    mark: "■",
    title: "Checked against a primary source or official advisory",
    className: "text-ink",
  },
  WATCH: {
    label: "Reported",
    mark: "◧",
    title: "Reported by the publisher; not independently checked by our desk",
    className: "text-caution",
  },
  UNVERIFIED: {
    label: "Unverified",
    mark: "□",
    title: "Claim not yet independently confirmed",
    className: "text-ink-3",
  },
};

export default function VerificationBadge({ status }: Props) {
  const c = CONFIG[status] || CONFIG.UNVERIFIED;
  return (
    <span className={`tag ${c.className}`} title={c.title}>
      <span aria-hidden className="text-[0.8em] leading-none">{c.mark}</span>
      <span>{c.label}</span>
    </span>
  );
}

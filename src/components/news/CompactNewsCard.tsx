import Link from "next/link";
import { NewsArticle } from "@/types/news";

interface Props {
  article: NewsArticle;
}

/** Headlines-only row: time, headline, country. Critical stories get the signal tick. */
export default function CompactNewsCard({ article }: Props) {
  const d = new Date(article.publishedAt);
  const stamp = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const critical = article.severity === "Critical";

  return (
    <Link
      href={`/article/${article.id}`}
      className="group grid grid-cols-[4rem_1fr] items-baseline gap-x-5 border-t border-rule py-3 transition-colors hover:bg-paper-raised sm:grid-cols-[5.5rem_1fr_auto]"
    >
      <span className="font-mono text-xs text-ink-3 tabular">{stamp}</span>
      <span className="flex items-baseline gap-2 text-[0.9375rem] leading-snug text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
        {critical && <span className="h-2 w-2 shrink-0 translate-y-[-1px] bg-signal" title="Critical" aria-label="Critical" />}
        {article.title}
      </span>
      <span className="col-start-2 text-xs font-medium text-ink-3 sm:col-start-auto">
        {article.country || article.region}
      </span>
    </Link>
  );
}

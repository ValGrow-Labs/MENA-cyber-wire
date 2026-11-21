import Link from "next/link";
import { NewsArticle } from "@/types/news";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import { ArrowBigUp, Clock } from "lucide-react";

interface Props {
  article: NewsArticle;
}

export default function CompactNewsCard({ article }: Props) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group flex items-center justify-between gap-4 p-3 rounded-xl bg-white border border-slate-border hover:border-teal/40 hover:shadow-coastal transition-all">
      <div className="flex items-start gap-3 min-w-0">
        <div className="hidden sm:flex flex-col items-center justify-center min-w-10 text-center py-1 px-1.5 rounded-lg bg-mist border border-mist-border">
          <ArrowBigUp className="w-3.5 h-3.5 text-teal" />
          <span className="text-[11px] font-bold text-ocean">{article.upvotes}</span>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap text-[11px]">
            <span className="font-bold text-ocean">{article.sourceName}</span>
            {article.country && (
              <>
                <span className="text-slate-muted">&middot;</span>
                <span className="font-bold text-teal">{article.country}</span>
              </>
            )}
            <span className="text-slate-muted">&middot;</span>
            <span className="text-slate-muted font-mono">{formattedDate}</span>
          </div>

          <Link href={`/article/${article.id}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-dark group-hover:text-teal transition-colors truncate max-w-xl">
              {article.title}
            </h4>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <ThreatSeverityBadge severity={article.severity} size="sm" />
        <Link
          href={`/article/${article.id}`}
          className="text-xs font-bold px-2.5 py-1 rounded-lg bg-ice text-ocean hover:bg-teal hover:text-white border border-slate-border transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}

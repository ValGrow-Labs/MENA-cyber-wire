import Link from "next/link";
import { NewsArticle } from "@/types/news";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import VerificationBadge from "@/components/shared/VerificationBadge";
import { ShieldCheck, ArrowRight, ExternalLink, Clock } from "lucide-react";

interface Props {
  article: NewsArticle;
}

export default function FeaturedStory({ article }: Props) {
  if (!article) return null;

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="relative rounded-2xl overflow-hidden bg-white border border-slate-border shadow-coastal-card transition-all duration-200">
      {/* Decorative top border */}
      <div className="h-1.5 w-full bg-teal" />

      {/* Hero Image Container */}
      {article.imageUrl && (
        <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-mist">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
        </div>
      )}

      <div className="relative p-6 sm:p-8">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-teal text-white">
              EDITORIAL INVESTIGATION
            </span>
            {article.country && (
              <span className="text-xs font-mono font-bold text-ocean bg-mist px-2.5 py-0.5 rounded-md border border-mist-border">
                {article.country.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThreatSeverityBadge severity={article.severity} size="sm" />
            <VerificationBadge status={article.verificationStatus} size="sm" />
          </div>
        </div>

        {/* Headline */}
        <Link href={`/article/${article.id}`}>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif tracking-tight text-ocean hover:text-teal transition-colors leading-tight">
            {article.title}
          </h1>
        </Link>

        {/* Summary */}
        <p className="mt-3 text-sm sm:text-base text-slate-dark line-clamp-3 leading-relaxed max-w-3xl">
          {article.description}
        </p>

        {/* Threat-to-Action Panel */}
        {article.threatToAction && (
          <div className="mt-5 p-4 rounded-xl bg-mist/60 border border-mist-border max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-ocean uppercase tracking-wider mb-2.5">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span>Threat-to-Action Protocol:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-dark">
              <div className="p-2.5 rounded-lg bg-white border border-slate-border">
                <span className="font-bold text-alert-orange block mb-0.5">IMPACT:</span>
                <span className="text-[11px] leading-snug">{article.threatToAction.whyItMatters}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-border">
                <span className="font-bold text-teal block mb-0.5">ACTION:</span>
                <span className="text-[11px] leading-snug">{article.threatToAction.whatShouldUsersDo}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-border">
                <span className="font-bold text-ocean block mb-0.5">AFFECTED:</span>
                <span className="text-[11px] leading-snug">{article.threatToAction.whoIsAffected}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer info & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-slate-muted">
            <span className="font-bold text-ocean">{article.sourceName}</span>
            <span>&middot;</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-teal" />
              <span>{formattedDate}</span>
            </span>
            <span>&middot;</span>
            <span>{article.readTime || "4 min read"}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-muted hover:text-teal font-semibold transition-colors"
            >
              <span>Source Record</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link
              href={`/article/${article.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal text-white font-bold text-xs hover:bg-teal-dark transition-all shadow-xs"
            >
              <span>Read Full Investigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowBigUp, 
  Bookmark, 
  MessageSquare, 
  Share2, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Clock, 
  Check, 
  Tag
} from "lucide-react";
import { NewsArticle } from "@/types/news";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import VerificationBadge from "@/components/shared/VerificationBadge";
import ThreatToActionPanel from "@/components/news/ThreatToActionPanel";
import { LocalStore } from "@/lib/storage/local-store";

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
}

export default function NewsCard({ article, priority = false }: NewsCardProps) {
  const [upvotes, setUpvotes] = useState(article.upvotes);
  const [hasVoted, setHasVoted] = useState<"up" | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showThreatToAction, setShowThreatToAction] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsSaved(LocalStore.isBookmarked(article.id));
    const votes = LocalStore.getUpvotedIds();
    if (votes[article.id] === "up") {
      setHasVoted("up");
    }
  }, [article.id]);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVoted === "up") {
      LocalStore.setVote(article.id, null);
      setHasVoted(null);
      setUpvotes((v) => v - 1);
    } else {
      LocalStore.setVote(article.id, "up");
      setHasVoted("up");
      setUpvotes((v) => v + 1);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = LocalStore.toggleBookmark({
      id: article.id,
      title: article.title,
      sourceName: article.sourceName,
      sourceUrl: article.sourceUrl,
      publishedAt: article.publishedAt,
      country: article.country,
      category: article.category,
      severity: article.severity,
      savedAt: new Date().toISOString(),
    });
    setIsSaved(saved);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/article/${article.id}` : article.sourceUrl;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `MENA Cyber Wire: ${article.title}`,
          url: shareUrl,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="group bg-white rounded-2xl border border-slate-border overflow-hidden hover:border-teal/40 hover:shadow-coastal-hover transition-all duration-300">
      {/* Top Source, Country & Status Bar */}
      <div className="px-4 py-2.5 bg-mist/50 border-b border-slate-border flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Publisher */}
          <span className="font-bold text-ocean">
            {article.sourceName}
          </span>
          <span className="text-slate-muted">&middot;</span>

          {/* Publication time */}
          <span className="text-[11px] text-slate-muted flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-teal" />
            <span>{formattedDate}</span>
          </span>

          {/* Country */}
          {article.country && (
            <>
              <span className="text-slate-muted">&middot;</span>
              <Link
                href={`/mena?country=${encodeURIComponent(article.country)}`}
                className="font-bold text-teal hover:underline"
              >
                {article.country}
              </Link>
            </>
          )}

          {/* Category */}
          <span className="text-slate-muted">&middot;</span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-ocean font-semibold border border-slate-border">
            {article.category}
          </span>
        </div>

        {/* Severity & Signal Badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ThreatSeverityBadge severity={article.severity} size="sm" />
          <VerificationBadge status={article.verificationStatus} size="sm" />
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Content Column */}
          <div className="flex-1 min-w-0">
            <Link href={`/article/${article.id}`}>
              <h2 className="text-base sm:text-lg font-bold font-heading text-ocean group-hover:text-teal transition-colors leading-snug">
                {article.title}
              </h2>
            </Link>

            <p className="mt-2 text-xs sm:text-sm text-slate-dark line-clamp-3 leading-relaxed">
              {article.description}
            </p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-ice text-slate-dark border border-slate-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Thumbnail */}
          {article.imageUrl && (
            <div className="relative w-full sm:w-36 h-28 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-mist border border-slate-border shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Expandable Threat-to-Action Protocol */}
        {article.threatToAction && (
          <div className="mt-3.5">
            <button
              onClick={() => setShowThreatToAction(!showThreatToAction)}
              className="flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-dark transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{showThreatToAction ? "Collapse Threat-to-Action Protocol" : "View Threat-to-Action Protocol"}</span>
              {showThreatToAction ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showThreatToAction && (
              <ThreatToActionPanel action={article.threatToAction} />
            )}
          </div>
        )}

        {/* Card Interaction Bar (Reddit + Instagram inspired) */}
        <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Upvote Pill */}
            <button
              onClick={handleVote}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                hasVoted === "up"
                  ? "bg-teal text-white border-teal shadow-xs"
                  : "bg-white text-ocean border-slate-border hover:bg-mist hover:border-teal/40"
              }`}
              title="Upvote intelligence report"
            >
              <ArrowBigUp className={`w-4 h-4 ${hasVoted === "up" ? "fill-white" : ""}`} />
              <span>{upvotes}</span>
            </button>

            {/* Comments */}
            <Link
              href={`/article/${article.id}#comments`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-ocean border border-slate-border hover:bg-mist hover:border-teal/40 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal" />
              <span>{article.commentCount}</span>
            </Link>

            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                isSaved
                  ? "bg-ocean text-amber-desert border-ocean font-bold"
                  : "bg-white text-ocean border-slate-border hover:bg-mist hover:border-teal/40"
              }`}
              title={isSaved ? "Saved to Bookmarks" : "Save for later"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-muted hover:text-ocean hover:bg-mist transition-colors"
              title="Share report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </button>
          </div>

          {/* Read Article & Source Link */}
          <div className="flex items-center gap-2">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[11px] text-slate-muted hover:text-teal font-medium"
              title="Open verified primary source"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <Link
              href={`/article/${article.id}`}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-ocean text-white hover:bg-ocean-dark transition-colors"
            >
              Analyze
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

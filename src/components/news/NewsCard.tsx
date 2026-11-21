"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Share2, Check, ChevronDown } from "lucide-react";
import { NewsArticle } from "@/types/news";
import ThreatToActionPanel from "@/components/news/ThreatToActionPanel";
import { LocalStore } from "@/lib/storage/local-store";
import StoryCover from "@/components/shared/StoryCover";

interface NewsCardProps {
  article: NewsArticle;
  priority?: boolean;
}

/** A row in the story river: timestamp column · story · optional thumbnail. */
export default function NewsCard({ article }: NewsCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsSaved(LocalStore.isBookmarked(article.id));
  }, [article.id]);

  const toggleSave = () => {
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

  const share = async () => {
    const url = `${window.location.origin}/article/${article.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const d = new Date(article.publishedAt);
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" });
  const day = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const actionBtn =
    "inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 transition-colors hover:text-ink";

  const ago = (() => {
    const m = Math.max(1, Math.round((Date.now() - d.getTime()) / 60000));
    if (m < 60) return m === 1 ? "1 minute ago" : `${m} minutes ago`;
    const h = Math.round(m / 60);
    if (h < 24) return h === 1 ? "1 hour ago" : `${h} hours ago`;
    if (h < 48) return "yesterday";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  })();

  return (
    <article className="view-in group flex gap-5 py-5">
      <Link href={`/article/${article.id}`} tabIndex={-1} className="w-36 shrink-0 sm:w-48">
        <StoryCover article={article} width={480} className="aspect-[4/3] w-full" />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-ink-3">
          {article.country ? `${article.country}, ` : ""}
          {article.category}
        </p>
        <Link href={`/article/${article.id}`}>
          <h2 className="mt-1 text-lg font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-2 sm:text-xl">
            {article.title}
          </h2>
        </Link>
        {article.description && (
          <p className="mt-1.5 max-w-3xl text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-2">{article.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-[0.8125rem] text-ink-3">
            {article.sourceName}, <time dateTime={article.publishedAt}>{ago}</time>
          </span>
          <span className="ml-auto flex items-center gap-4">
            {article.threatToAction && (
              <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className={actionBtn}>
                Key points
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
              </button>
            )}
            <button onClick={toggleSave} aria-pressed={isSaved} className={`${actionBtn} ${isSaved ? "text-ink" : ""}`}>
              <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} strokeWidth={1.5} />
              {isSaved ? "Saved" : "Save"}
            </button>
            <button onClick={share} className={actionBtn}>
              {copied ? <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />}
              {copied ? "Copied" : "Share"}
            </button>
          </span>
        </div>

        {open && article.threatToAction && (
          <div className="animate-rise">
            <ThreatToActionPanel action={article.threatToAction} />
          </div>
        )}
      </div>
    </article>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StoryCover from "@/components/shared/StoryCover";
import { ArrowLeft, Bookmark, Share2, Check } from "lucide-react";
import { NewsArticle } from "@/types/news";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import VerificationBadge from "@/components/shared/VerificationBadge";
import ThreatToActionPanel from "@/components/news/ThreatToActionPanel";
import { LocalStore } from "@/lib/storage/local-store";

interface ArticleComment {
  id: string;
  name: string;
  role: string;
  timestamp: string;
  text: string;
}

const ROLES = [
  "Security analyst",
  "SOC team lead",
  "CISO / security director",
  "Threat intelligence researcher",
  "IT administrator",
];

function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-5" role="status" aria-label="Loading story">
      <div className="h-3 w-32 bg-paper-sunk" />
      <div className="h-11 w-full bg-paper-sunk" />
      <div className="h-11 w-3/4 bg-paper-sunk" />
      <div className="h-5 w-5/6 bg-paper-sunk" />
      <div className="h-px w-full bg-rule" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 bg-paper-sunk" style={{ width: `${92 - i * 7}%` }} />
      ))}
    </div>
  );
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentRole, setCommentRole] = useState(ROLES[0]);
  const [commentBody, setCommentBody] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const found = data.data?.find((a: NewsArticle) => a.id === id);
        if (found) {
          setArticle(found);
          setIsSaved(LocalStore.isBookmarked(found.id));
          // Keep reading: same country first, then same topic, then the newest stories.
          const pool: NewsArticle[] = data.data
            .filter((a: NewsArticle) => a.id !== id && !a.id.startsWith("mcw-desk-"))
            .sort((x: NewsArticle, y: NewsArticle) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime());
          const ordered = [
            ...pool.filter((a) => found.country && a.country === found.country),
            ...pool.filter((a) => a.category === found.category),
            ...pool,
          ];
          setRelatedArticles(Array.from(new Map(ordered.map((a) => [a.id, a])).values()).slice(0, 4));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    try {
      const saved = localStorage.getItem(`mena_article_comments_${id}`);
      setComments(saved ? JSON.parse(saved) : []);
    } catch {
      setComments([]);
    }
  }, [id]);

  const handleBookmark = () => {
    if (!article) return;
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

  const handleShare = async () => {
    if (!article) return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    const next: ArticleComment = {
      id: `c_${Date.now()}`,
      name: commentName.trim() || "Anonymous",
      role: commentRole,
      timestamp: new Date().toISOString(),
      text: commentBody.trim(),
    };
    const updated = [next, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(`mena_article_comments_${id}`, JSON.stringify(updated));
    } catch {}
    setCommentBody("");
  };

  if (loading) return <ArticleSkeleton />;

  if (!article) {
    return (
      <div className="border-t-2 border-edge pt-6">
        <p className="kicker">Story not found</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">We couldn&apos;t find this story.</h1>
        <p className="mt-3 max-w-prose text-ink-2">
          Stories come from live feeds and drop out of the cache after a while. The original may still be on the
          publisher&apos;s site.
        </p>
        <button onClick={() => router.push("/")} className="btn-primary mt-6">
          Back to the front page
        </button>
      </div>
    );
  }

  const published = new Date(article.publishedAt);
  const dateLong = published.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeShort = published.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Riyadh",
  });

  const paragraphs = article.content ? article.content.split("\n\n").filter((p) => p.trim()) : [];

  const actionBtn =
    "inline-flex items-center gap-1.5 text-xs font-medium text-ink-3 transition-colors hover:text-ink";

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4 text-xs font-medium text-ink-3">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Back
        </button>
        <ol className="flex min-w-0 items-center gap-2">
          <li><Link href="/" className="hover:text-ink">Latest</Link></li>
          {article.country && (
            <>
              <li aria-hidden>/</li>
              <li className="truncate">
                <Link href={`/mena?country=${encodeURIComponent(article.country)}`} className="hover:text-ink">
                  {article.country}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="truncate text-ink">{article.category}</li>
        </ol>
      </nav>

      <article className="mt-8">
        <header>
          <p className="kicker flex flex-wrap gap-x-3">
            {article.country && <span>{article.country}</span>}
            <span>{article.category}</span>
          </p>
          <h1 className="mt-3 font-serif text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl lg:text-[3.5rem]">
            {article.title}
          </h1>
          <p className="mt-5 max-w-prose font-serif text-xl leading-relaxed text-ink-2">{article.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-rule py-3">
            <div className="text-sm">
              <span className="text-ink-3">Reported by </span>
              <span className="font-medium text-ink">{article.sourceName}</span>
            </div>
            <time dateTime={article.publishedAt} className="text-xs font-medium text-ink-3 tabular">
              {dateLong} · {timeShort} AST
            </time>
            {article.readTime && (
              <span className="text-xs font-medium text-ink-3">{article.readTime}</span>
            )}
            <span className="flex items-center gap-4">
              <ThreatSeverityBadge severity={article.severity} />
              <VerificationBadge status={article.verificationStatus} />
            </span>
            <span className="flex items-center gap-4 sm:ml-auto">
              <button onClick={handleBookmark} aria-pressed={isSaved} className={`${actionBtn} ${isSaved ? "text-ink" : ""}`}>
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} strokeWidth={1.5} />
                {isSaved ? "Saved" : "Save"}
              </button>
              <button onClick={handleShare} className={actionBtn}>
                {copied ? <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />}
                {copied ? "Link copied" : "Copy link"}
              </button>
            </span>
          </div>
        </header>

        {article.imageUrl && (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt=""
              className="max-h-[460px] w-full rounded-xl bg-paper-sunk object-cover"
            />
          </figure>
        )}

        {article.threatToAction && (
          <section aria-label="Key points" className="mt-10">
            <div className="section-head">
              <h2 className="section-title">Key points</h2>
            </div>
            <ThreatToActionPanel action={article.threatToAction} />
          </section>
        )}

        <div className="mt-10 max-w-prose space-y-6 font-serif text-[1.125rem] leading-[1.75] text-ink-2">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-serif first-letter:text-[3.6rem] first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-ink"
                    : ""
                }
              >
                {para}
              </p>
            ))
          ) : (
            <p className="border-l-2 border-edge pl-4 font-sans text-[0.9375rem] leading-relaxed text-ink-2">
              This is {article.sourceName}&apos;s summary. The full article, with quotes and technical detail, is on their site.
            </p>
          )}
        </div>

        {/* Source attribution */}
        <aside className="mt-10 max-w-prose border-t-2 border-edge pt-4">
          <p className="kicker">Source</p>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
            Originally reported by <span className="font-medium text-ink">{article.sourceName}</span>. Read the
            primary source for full details, quotes and updates.
          </p>
          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4">
            Read on {article.sourceName} ↗
          </a>
        </aside>

        {article.tags?.length > 0 && (
          <div className="mt-8 flex max-w-prose flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="kicker">Filed under</span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="font-mono text-xs text-ink-2 underline decoration-rule underline-offset-4 hover:decoration-ink"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {relatedArticles.length > 0 && (
        <section aria-label="Keep reading" className="mt-16 border-t-2 border-ink pt-4">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Keep reading</h2>
          <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {relatedArticles.map((rel) => (
              <Link key={rel.id} href={`/article/${rel.id}`} className="view-in group flex gap-4">
                <StoryCover article={rel} width={400} className="aspect-[4/3] w-32 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-brand">{rel.country || (rel.region === "Global" ? "Global" : rel.category)}</p>
                  <h3 className="mt-1 font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-2">{rel.title}</h3>
                  <p className="mt-1.5 text-xs text-ink-3">{rel.sourceName}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Discussion */}
      <section id="comments" aria-label="Discussion" className="mt-16">
        <div className="section-head">
          <h2 className="section-title">
            Discussion <span className="ml-1 font-mono text-sm font-normal text-ink-3 tabular">{comments.length}</span>
          </h2>
          <span className="text-xs font-medium text-ink-3">Stored in this browser only</span>
        </div>

        <form onSubmit={handleAddComment} className="max-w-prose space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="kicker">Name or handle</span>
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Optional"
                className="field mt-1.5"
              />
            </label>
            <label className="block">
              <span className="kicker">Role</span>
              <select value={commentRole} onChange={(e) => setCommentRole(e.target.value)} className="field mt-1.5">
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="kicker">Comment</span>
            <textarea
              required
              rows={4}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="What are you seeing? Indicators, mitigations, questions."
              className="field mt-1.5 resize-y"
            />
          </label>
          <button type="submit" className="btn-primary" disabled={!commentBody.trim()}>
            Post comment
          </button>
        </form>

        <div className="mt-8 max-w-prose">
          {comments.length === 0 ? (
            <p className="border-t border-rule py-6 text-ink-3">No comments yet.</p>
          ) : (
            <ul className="border-b border-rule">
              {comments.map((c) => (
                <li key={c.id} className="border-t border-rule py-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-medium text-ink">{c.name}</span>
                    <span className="text-sm text-ink-3">{c.role}</span>
                    <time dateTime={c.timestamp} className="ml-auto font-mono text-2xs text-ink-3 tabular">
                      {new Date(c.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  </div>
                  <p className="mt-2 leading-relaxed text-ink-2">{c.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

    </div>
  );
}

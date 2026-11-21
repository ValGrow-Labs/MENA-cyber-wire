"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { NewsArticle } from "@/types/news";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import VerificationBadge from "@/components/shared/VerificationBadge";
import ThreatToActionPanel from "@/components/news/ThreatToActionPanel";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Clock, 
  MessageSquare, 
  Send, 
  Check, 
  ArrowRight
} from "lucide-react";
import { LocalStore } from "@/lib/storage/local-store";

interface ArticleComment {
  id: string;
  name: string;
  role: string;
  timestamp: string;
  text: string;
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

  // Comments state
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentRole, setCommentRole] = useState("Security Analyst");
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
          const related = data.data
            .filter((a: NewsArticle) => a.id !== id && (a.category === found.category || a.country === found.country))
            .slice(0, 3);
          setRelatedArticles(related);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));

    try {
      const saved = localStorage.getItem(`mena_article_comments_${id}`);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        setComments([
          {
            id: "c1",
            name: "Hassan Al-Nuaimi",
            role: "Incident Responder",
            timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
            text: "Corroborated IOCs match telemetry seen in our Gulf SOC earlier this week. The initial vector was an unpatched perimeter edge gateway.",
          },
        ]);
      }
    } catch {}
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
    const url = typeof window !== "undefined" ? window.location.href : article.sourceUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    const newComment: ArticleComment = {
      id: `c_${Date.now()}`,
      name: commentName.trim() || "Anonymous Analyst",
      role: commentRole,
      timestamp: new Date().toISOString(),
      text: commentBody.trim(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(`mena_article_comments_${id}`, JSON.stringify(updated));
    } catch {}
    setCommentBody("");
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!article) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-border shadow-coastal-card space-y-4">
        <h2 className="text-base font-bold text-ocean">
          Intelligence Report Not Found
        </h2>
        <p className="text-xs text-slate-muted">
          The requested intelligence report may have expired from active caches.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-teal text-white hover:bg-teal-dark shadow-coastal"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Navigation Bar */}
      <div className="flex items-center justify-between text-xs text-slate-muted">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-bold text-ocean hover:text-teal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Link href="/" className="hover:underline">Feed</Link>
          <span>/</span>
          {article.country && (
            <>
              <Link href={`/mena?country=${encodeURIComponent(article.country)}`} className="hover:underline">
                {article.country}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="font-bold text-teal">{article.category}</span>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="bg-white rounded-2xl border border-slate-border overflow-hidden p-6 sm:p-8 space-y-6 shadow-coastal-card">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 text-xs font-bold rounded-lg bg-mist text-ocean border border-mist-border">
              {article.category}
            </span>
            {article.country && (
              <span className="px-3 py-0.5 text-xs font-mono font-bold rounded-lg bg-teal-light text-teal border border-teal-border">
                {article.country}
              </span>
            )}
            <span className="text-xs text-slate-muted">&middot;</span>
            <span className="text-xs text-slate-muted flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-teal" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThreatSeverityBadge severity={article.severity} />
            <VerificationBadge status={article.verificationStatus} />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif tracking-tight text-ocean leading-tight">
          {article.title}
        </h1>

        {/* Lead / Description */}
        <p className="text-base sm:text-lg text-slate-dark font-medium leading-relaxed">
          {article.description}
        </p>

        {/* Attribution Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 rounded-xl bg-mist border border-mist-border text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold">
              MCW
            </div>
            <div>
              <span className="font-bold text-ocean block">
                Publisher: {article.sourceName}
              </span>
              <span className="text-[11px] text-slate-muted">
                Verified by MENA Cyber Wire Editorial Desk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                isSaved
                  ? "bg-ocean text-amber-desert border-ocean"
                  : "bg-white text-ocean border-slate-border hover:bg-mist"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-border bg-white text-ocean hover:bg-mist text-xs font-bold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>

            {/* Source URL button */}
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal text-white hover:bg-teal-dark text-xs font-bold transition-all shadow-coastal"
            >
              <span>Original Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="rounded-2xl overflow-hidden max-h-[420px] bg-mist border border-slate-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Threat-to-Action Protocol Section */}
        {article.threatToAction && (
          <div className="my-6">
            <ThreatToActionPanel action={article.threatToAction} />
          </div>
        )}

        {/* Main Article Body Text */}
        <div className="prose max-w-none text-sm sm:text-base leading-relaxed text-slate-dark space-y-4">
          {article.content ? (
            article.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <>
              <p>
                Cybersecurity monitoring units operating within the Middle East and North Africa (MENA) have observed sustained indicators related to this development. Organizations operating across critical infrastructure, telecommunications, financial services, and sovereign cloud infrastructure are advised to review relevant network perimeter access policies.
              </p>
              <p>
                According to intelligence telemetry shared across regional computer emergency response teams (aeCERT, NCA, Q-CERT, EG-CERT), malicious activity patterns exhibit heightened exploitation velocity following public vulnerability disclosures. Defensive posture recommendations emphasize strict network isolation, hardware-enforced multifactor authentication, and immediate patch deployment.
              </p>
            </>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-border">
            <span className="text-xs font-bold text-ocean block mb-2">
              Related Tags & Threat Vectors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-ice text-slate-dark border border-slate-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Practitioner Comments & Thread Section */}
      <section id="comments" className="bg-white rounded-2xl border border-slate-border p-6 sm:p-8 space-y-6 shadow-coastal-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal" />
            <h3 className="text-base font-bold text-ocean">
              Practitioner Observations & Discussion ({comments.length})
            </h3>
          </div>
          <span className="text-xs text-slate-muted">Anonymous & Verified Exchange</span>
        </div>

        {/* Post Comment Form */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <input
              type="text"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Your handle or initials (optional)"
              className="px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
            />
            <select
              value={commentRole}
              onChange={(e) => setCommentRole(e.target.value)}
              className="px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
            >
              <option>Security Analyst</option>
              <option>SOC Team Lead</option>
              <option>CISO / Security Director</option>
              <option>Threat Intelligence Researcher</option>
              <option>IT Administrator</option>
            </select>
          </div>

          <textarea
            required
            rows={3}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Share technical observations, IOC corroboration, or mitigation questions..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal text-white hover:bg-teal-dark font-bold text-xs transition-all shadow-coastal"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Comment</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3 pt-4 border-t border-slate-border">
          {comments.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl bg-ice border border-slate-border space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ocean">
                    {c.name}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] rounded-md bg-mist text-ocean font-semibold">
                    {c.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-muted font-mono">
                  {new Date(c.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-dark leading-relaxed">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Intelligence */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ocean">
            Related Regional Intelligence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.id}
                href={`/article/${rel.id}`}
                className="p-4 rounded-2xl bg-white border border-slate-border hover:border-teal/50 hover:shadow-coastal transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] text-teal font-bold mb-1">
                    <span>{rel.country || "MENA"}</span>
                    <span>&middot;</span>
                    <span>{rel.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-ocean line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-muted">
                  <span>{rel.sourceName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

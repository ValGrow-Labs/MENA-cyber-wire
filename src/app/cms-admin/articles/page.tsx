"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Star,
  Radio,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";
import { CMSArticle } from "@/types/cms";
import ConfirmModal from "@/components/cms/ConfirmModal";
import { useAdmin } from "../layout";

export default function CMSArticlesPage() {
  const { notify } = useAdmin();
  const [articles, setArticles] = useState<CMSArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<CMSArticle | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (countryFilter !== "all") params.append("country", countryFilter);
      if (verificationFilter !== "all") params.append("verification", verificationFilter);

      const res = await fetch(`/api/cms/articles?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setArticles(json.data);
      }
    } catch {
      notify("Failed to fetch articles", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, countryFilter, verificationFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleTogglePublish = async (article: CMSArticle) => {
    const nextStatus = article.editorialStatus === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch(`/api/cms/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editorialStatus: nextStatus }),
      });
      if (res.ok) {
        notify(`Article marked as ${nextStatus}`, "success");
        fetchArticles();
      }
    } catch {
      notify("Failed to update status", "error");
    }
  };

  const handleToggleFeatured = async (article: CMSArticle) => {
    const nextFeatured = !article.isFeatured;
    try {
      const res = await fetch(`/api/cms/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFeatured: nextFeatured,
          featuredPosition: nextFeatured ? (article.featuredPosition === "none" ? "secondary" : article.featuredPosition) : "none",
        }),
      });
      if (res.ok) {
        notify(`Article ${nextFeatured ? "featured" : "removed from featured"}`, "info");
        fetchArticles();
      }
    } catch {
      notify("Failed to update featured flag", "error");
    }
  };

  const handleDuplicate = async (article: CMSArticle) => {
    try {
      const duplicated: Partial<CMSArticle> = {
        ...article,
        id: `art-${Date.now()}`,
        headline: `${article.headline} (Copy)`,
        slug: `${article.slug}-copy`,
        editorialStatus: "Draft",
        publishedAt: new Date().toISOString(),
      };
      const res = await fetch("/api/cms/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicated),
      });
      if (res.ok) {
        notify("Article duplicated as Draft", "success");
        fetchArticles();
      }
    } catch {
      notify("Failed to duplicate article", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/articles/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        notify("Article permanently deleted", "success");
        setDeleteTarget(null);
        fetchArticles();
      } else {
        const d = await res.json();
        notify(d.error || "Delete failed", "error");
      }
    } catch {
      notify("Failed to delete article", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Articles
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Manage and publish news reports and threat analyses.
          </p>
        </div>

        <Link
          href="/cms-admin/articles/new"
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#707070]">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by headline, tags, keywords, or summary..."
              className="w-full rounded-md border border-[#2B2B2B] bg-[#191919] py-2 pl-9 pr-3 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md border border-[#2B2B2B] bg-[#191919] px-4 py-2 text-xs font-semibold text-[#F5F5F5] hover:bg-[#202020]"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 text-[#707070]">
            <Filter size={14} />
            <span>Filter by:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-[#2B2B2B] bg-[#191919] px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Under Review">Under Review</option>
            <option value="Archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded border border-[#2B2B2B] bg-[#191919] px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Ransomware">Ransomware</option>
            <option value="Data Breach">Data Breach</option>
            <option value="Critical Infrastructure">Critical Infrastructure</option>
            <option value="Espionage & APT">Espionage & APT</option>
            <option value="Vulnerability">Vulnerability</option>
            <option value="Fintech & Banking">Fintech & Banking</option>
            <option value="Cloud & AI">Cloud & AI</option>
            <option value="Policy & Regulation">Policy & Regulation</option>
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="rounded border border-[#2B2B2B] bg-[#191919] px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
          >
            <option value="all">All Countries</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Qatar">Qatar</option>
            <option value="Egypt">Egypt</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Oman">Oman</option>
            <option value="Jordan">Jordan</option>
            <option value="Iraq">Iraq</option>
            <option value="Morocco">Morocco</option>
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="rounded border border-[#2B2B2B] bg-[#191919] px-2.5 py-1.5 text-xs text-[#F5F5F5] focus:outline-none"
          >
            <option value="all">All Verifications</option>
            <option value="SIGNAL">SIGNAL (Verified)</option>
            <option value="WATCH">WATCH (Developing)</option>
            <option value="UNVERIFIED">UNVERIFIED</option>
          </select>

          {(search || statusFilter !== "all" || categoryFilter !== "all" || countryFilter !== "all" || verificationFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setCountryFilter("all");
                setVerificationFilter("all");
              }}
              className="text-xs text-[#D63838] hover:underline"
            >
              Reset Filters
            </button>
          )}

          <div className="ml-auto font-mono text-[11px] text-[#707070]">
            {articles.length} articles matching
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="overflow-x-auto rounded-lg border border-[#2B2B2B] bg-[#151515]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#2B2B2B] bg-[#191919] font-mono text-[11px] uppercase tracking-wider text-[#707070]">
            <tr>
              <th className="py-3 px-4">Headline & Summary</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Severity</th>
              <th className="py-3 px-3">Verification</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Published</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B2B2B] text-[#F5F5F5]">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#707070]">
                  Loading articles...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#707070]">
                  No articles found matching criteria.
                </td>
              </tr>
            ) : (
              articles.map((art) => (
                <tr key={art.id} className="hover:bg-[#191919]/60 transition-colors">
                  {/* Headline & details */}
                  <td className="py-3 px-4 max-w-sm">
                    <div className="flex items-start gap-2">
                      {art.isBreaking && (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded bg-[#D63838] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase">
                          <Radio size={10} /> BREAKING
                        </span>
                      )}
                      {art.isFeatured && (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded bg-[#F2B45B]/20 text-[#F2B45B] border border-[#F2B45B]/30 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase">
                          <Star size={10} /> {art.featuredPosition}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/cms-admin/articles/${art.id}`}
                      className="mt-1 block font-serif text-sm font-semibold hover:text-[#D63838] line-clamp-2"
                    >
                      {art.headline}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[#707070]">
                      {art.shortDescription}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-[#A1A1A1]">
                      Source: {art.sourceName} &middot; Author: {art.author}
                    </p>
                  </td>

                  {/* Category & Region */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="block font-medium text-[#F5F5F5]">{art.category}</span>
                    <span className="block font-mono text-[10px] text-[#087E8B]">
                      {art.country || art.region}
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        art.severity === "Critical"
                          ? "bg-[#D63838]/20 text-[#D63838] border border-[#D63838]/30"
                          : art.severity === "High"
                          ? "bg-[#E45B48]/20 text-[#E45B48] border border-[#E45B48]/30"
                          : art.severity === "Medium"
                          ? "bg-[#F2B45B]/20 text-[#F2B45B] border border-[#F2B45B]/30"
                          : "bg-[#27AE60]/20 text-[#27AE60] border border-[#27AE60]/30"
                      }`}
                    >
                      {art.severity}
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        art.verificationStatus === "SIGNAL"
                          ? "bg-[#087E8B]/20 text-[#087E8B] border border-[#087E8B]/40"
                          : art.verificationStatus === "WATCH"
                          ? "bg-[#F2B45B]/20 text-[#F2B45B] border border-[#F2B45B]/40"
                          : "bg-[#707070]/20 text-[#A1A1A1] border border-[#707070]/40"
                      }`}
                    >
                      {art.verificationStatus}
                    </span>
                  </td>

                  {/* Editorial Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        art.editorialStatus === "Published"
                          ? "bg-[#27AE60]/15 text-[#27AE60]"
                          : art.editorialStatus === "Draft"
                          ? "bg-[#707070]/20 text-[#A1A1A1]"
                          : art.editorialStatus === "Scheduled"
                          ? "bg-[#2D9CDB]/15 text-[#2D9CDB]"
                          : "bg-[#F2B45B]/15 text-[#F2B45B]"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {art.editorialStatus}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 font-mono text-[11px] text-[#A1A1A1] whitespace-nowrap">
                    {new Date(art.publishedAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/cms-admin/articles/${art.id}`}
                        className="rounded p-1 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                        title="Edit Article"
                      >
                        <Edit3 size={15} />
                      </Link>

                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`rounded p-1 ${
                          art.editorialStatus === "Published"
                            ? "text-[#27AE60] hover:bg-[#202020] hover:text-[#D63838]"
                            : "text-[#707070] hover:bg-[#202020] hover:text-[#27AE60]"
                        }`}
                        title={art.editorialStatus === "Published" ? "Unpublish" : "Publish"}
                      >
                        {art.editorialStatus === "Published" ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(art)}
                        className={`rounded p-1 ${
                          art.isFeatured
                            ? "text-[#F2B45B] hover:bg-[#202020]"
                            : "text-[#707070] hover:bg-[#202020] hover:text-[#F2B45B]"
                        }`}
                        title={art.isFeatured ? "Unfeature" : "Feature on Homepage"}
                      >
                        <Star size={15} />
                      </button>

                      <button
                        onClick={() => handleDuplicate(art)}
                        className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#F5F5F5]"
                        title="Duplicate Article"
                      >
                        <Copy size={15} />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(art)}
                        className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                        title="Delete Article"
                      >
                        <Trash2 size={15} />
                      </button>

                      <a
                        href={`/article/${art.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#F5F5F5]"
                        title="View Live Reader View"
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Intelligence Article?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.headline}"? This action is recorded in the security audit logs and cannot be undone.`}
        confirmLabel="Delete Permanently"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileCheck2,
  Clock,
  Radio,
  FolderTree,
  Globe2,
  ShieldAlert,
  Binary,
  Plus,
  ArrowRight,
  TrendingUp,
  History,
  CalendarDays,
} from "lucide-react";

export default function CMSDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/cms/dashboard");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setData(json);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-xs text-[#707070]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D63838] border-t-transparent" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentArticles = data?.recentlyUpdatedArticles || [];
  const recentLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B2B2B] pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Dashboard
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Overview of published articles, desk activity, and content status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/cms-admin/articles/new"
            className="flex items-center gap-2 rounded-md bg-[#D63838] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
          >
            <Plus size={15} />
            <span>Create Article</span>
          </Link>
          <Link
            href="/cms-admin/breaking"
            className="flex items-center gap-2 rounded-md border border-[#2B2B2B] bg-[#191919] px-3.5 py-2 text-xs font-semibold text-[#F5F5F5] hover:bg-[#202020]"
          >
            <Radio size={15} className="text-[#D63838]" />
            <span>Post Breaking Alert</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4">
          <div className="flex items-center justify-between text-[#27AE60]">
            <FileCheck2 size={18} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1A1]">Live</span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-[#F5F5F5]">{stats.totalPublished || 0}</p>
          <p className="text-xs text-[#A1A1A1]">Published Articles</p>
        </div>

        <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4">
          <div className="flex items-center justify-between text-[#F2B45B]">
            <FileText size={18} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1A1]">Desk</span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-[#F5F5F5]">{stats.totalDrafts || 0}</p>
          <p className="text-xs text-[#A1A1A1]">Draft Articles</p>
        </div>

        <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4">
          <div className="flex items-center justify-between text-[#D63838]">
            <Radio size={18} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1A1]">Urgent</span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-[#F5F5F5]">{stats.totalBreaking || 0}</p>
          <p className="text-xs text-[#A1A1A1]">Breaking Alerts</p>
        </div>

        <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4">
          <div className="flex items-center justify-between text-[#2D9CDB]">
            <Clock size={18} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1A1]">Queue</span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-[#F5F5F5]">{stats.totalScheduled || 0}</p>
          <p className="text-xs text-[#A1A1A1]">Scheduled Articles</p>
        </div>

        <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#087E8B]">
            <TrendingUp size={18} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1A1]">24h / 7d</span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-[#F5F5F5]">
            {stats.publishedToday || 0}{" "}
            <span className="text-xs font-normal text-[#707070]">/ {stats.publishedThisWeek || 0}</span>
          </p>
          <p className="text-xs text-[#A1A1A1]">Published This Week</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link
          href="/cms-admin/countries"
          className="flex items-center justify-between rounded-lg border border-[#2B2B2B] bg-[#191919] p-3 text-xs text-[#A1A1A1] transition-colors hover:border-[#707070] hover:text-[#F5F5F5]"
        >
          <div className="flex items-center gap-2.5">
            <Globe2 size={16} className="text-[#087E8B]" />
            <span>National Desks</span>
          </div>
          <span className="font-mono font-bold text-[#F5F5F5]">{stats.totalCountries || 13}</span>
        </Link>

        <Link
          href="/cms-admin/categories"
          className="flex items-center justify-between rounded-lg border border-[#2B2B2B] bg-[#191919] p-3 text-xs text-[#A1A1A1] transition-colors hover:border-[#707070] hover:text-[#F5F5F5]"
        >
          <div className="flex items-center gap-2.5">
            <FolderTree size={16} className="text-[#F2B45B]" />
            <span>Threat Categories</span>
          </div>
          <span className="font-mono font-bold text-[#F5F5F5]">{stats.totalCategories || 8}</span>
        </Link>

        <Link
          href="/cms-admin/research"
          className="flex items-center justify-between rounded-lg border border-[#2B2B2B] bg-[#191919] p-3 text-xs text-[#A1A1A1] transition-colors hover:border-[#707070] hover:text-[#F5F5F5]"
        >
          <div className="flex items-center gap-2.5">
            <Binary size={16} className="text-[#9B51E0]" />
            <span>Threat Actors</span>
          </div>
          <span className="font-mono font-bold text-[#F5F5F5]">{stats.totalResearch || 4}</span>
        </Link>

        <Link
          href="/cms-admin/vulnerabilities"
          className="flex items-center justify-between rounded-lg border border-[#2B2B2B] bg-[#191919] p-3 text-xs text-[#A1A1A1] transition-colors hover:border-[#707070] hover:text-[#F5F5F5]"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={16} className="text-[#D63838]" />
            <span>Annotated CVEs</span>
          </div>
          <span className="font-mono font-bold text-[#F5F5F5]">{stats.totalVulnerabilities || 2}</span>
        </Link>
      </div>

      {/* Main Grid: Publishing Activity & Audit Logs */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Recently Modified Content */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">
              Recent Articles
            </h3>
            <Link
              href="/cms-admin/articles"
              className="flex items-center gap-1 font-mono text-xs text-[#D63838] hover:underline"
            >
              <span>All Articles</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#2B2B2B] bg-[#151515]">
            <div className="divide-y divide-[#2B2B2B]">
              {recentArticles.length === 0 ? (
                <p className="p-6 text-center text-xs text-[#707070]">No recent articles found.</p>
              ) : (
                recentArticles.map((art: any) => (
                  <div key={art.id} className="flex items-start justify-between p-4 hover:bg-[#191919] transition-colors">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#202020] px-1.5 py-0.5 font-mono text-[10px] text-[#A1A1A1]">
                          {art.category}
                        </span>
                        {art.country && (
                          <span className="rounded bg-[#087E8B]/15 px-1.5 py-0.5 font-mono text-[10px] text-[#087E8B]">
                            {art.country}
                          </span>
                        )}
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                            art.editorialStatus === "Published"
                              ? "bg-[#27AE60]/15 text-[#27AE60]"
                              : "bg-[#F2B45B]/15 text-[#F2B45B]"
                          }`}
                        >
                          {art.editorialStatus}
                        </span>
                      </div>
                      <Link
                        href={`/cms-admin/articles/${art.id}`}
                        className="mt-1 block truncate font-serif text-sm font-semibold text-[#F5F5F5] hover:text-[#D63838]"
                      >
                        {art.headline}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-[#707070]">
                        By {art.author || "Desk"} &middot; Updated {new Date(art.updatedAt || art.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/cms-admin/articles/${art.id}`}
                      className="shrink-0 rounded border border-[#2B2B2B] bg-[#191919] px-2.5 py-1 text-xs text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Audit Log Feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-[#D63838]" />
              <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">
                Recent Activity
              </h3>
            </div>
            <Link
              href="/cms-admin/audit-logs"
              className="font-mono text-xs text-[#707070] hover:text-[#F5F5F5]"
            >
              Full Log →
            </Link>
          </div>

          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4 divide-y divide-[#2B2B2B] text-xs">
            {recentLogs.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#707070]">No audit entries recorded yet.</p>
            ) : (
              recentLogs.slice(0, 6).map((log: any) => (
                <div key={log.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-semibold text-[#D63838]">{log.action}</span>
                    <span className="text-[#707070]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1 text-[#F5F5F5] truncate">{log.targetTitle || log.details}</p>
                  <p className="mt-0.5 text-[10px] text-[#707070] truncate">
                    {log.adminEmail} &middot; {log.targetType}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

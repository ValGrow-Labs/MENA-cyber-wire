"use client";

import { useEffect, useState } from "react";
import { LocalStore, BookmarkItem } from "@/lib/storage/local-store";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const loadBookmarks = () => {
    setBookmarks(LocalStore.getBookmarks());
  };

  useEffect(() => {
    loadBookmarks();
    window.addEventListener("mena_bookmarks_changed", loadBookmarks);
    return () => window.removeEventListener("mena_bookmarks_changed", loadBookmarks);
  }, []);

  const handleRemove = (id: string) => {
    LocalStore.toggleBookmark({
      id,
      title: "",
      sourceName: "",
      sourceUrl: "",
      publishedAt: "",
      category: "",
      severity: "",
      savedAt: "",
    });
    loadBookmarks();
  };

  const handleClearAll = () => {
    if (confirm("Clear all saved bookmarks?")) {
      try {
        localStorage.removeItem("mena_cyber_wire_bookmarks");
        window.dispatchEvent(new Event("mena_bookmarks_changed"));
        setBookmarks([]);
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-border shadow-coastal-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-teal">
            <Bookmark className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Saved Intelligence Vault
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-ocean">
            Bookmarked Reports & Advisories
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Locally stored intelligence items for offline reference and investigation.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-alert-orange bg-alert-light border border-alert-border hover:bg-alert-orange hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-border shadow-coastal-card space-y-3">
          <div className="inline-flex p-3 rounded-full bg-mist text-teal">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-ocean">
            No Saved Intelligence Reports
          </h3>
          <p className="text-xs text-slate-muted max-w-sm mx-auto">
            Click the bookmark icon on any news report or vulnerability card to pin it to your personal intelligence vault.
          </p>
          <Link
            href="/"
            className="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal text-white hover:bg-teal-dark shadow-coastal"
          >
            Explore Intelligence Feed
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal/50 hover:shadow-coastal transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-muted">
                  <span className="font-bold text-ocean">{item.sourceName}</span>
                  {item.country && (
                    <>
                      <span>&middot;</span>
                      <span className="text-teal font-bold">{item.country}</span>
                    </>
                  )}
                  <span>&middot;</span>
                  <span>{item.category}</span>
                </div>

                <Link href={`/article/${item.id}`}>
                  <h3 className="text-sm sm:text-base font-bold text-ocean hover:text-teal transition-colors">
                    {item.title}
                  </h3>
                </Link>

                <div className="text-[10px] text-slate-muted font-mono">
                  Saved {new Date(item.savedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/article/${item.id}`}
                  className="px-3.5 py-1 text-xs font-bold rounded-lg bg-ice text-ocean hover:bg-teal hover:text-white border border-slate-border transition-colors"
                >
                  Read
                </Link>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-1.5 rounded-lg text-slate-muted hover:text-alert-orange hover:bg-alert-light transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

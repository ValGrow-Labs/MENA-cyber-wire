"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LocalStore, BookmarkItem } from "@/lib/storage/local-store";

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = () => {
    setBookmarks(LocalStore.getBookmarks());
    setLoaded(true);
  };

  useEffect(() => {
    load();
    window.addEventListener("mena_bookmarks_changed", load);
    return () => window.removeEventListener("mena_bookmarks_changed", load);
  }, []);

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 4000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  const remove = (id: string) => {
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
    load();
  };

  const clearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    try {
      localStorage.removeItem("mena_cyber_wire_bookmarks");
      window.dispatchEvent(new Event("mena_bookmarks_changed"));
      setBookmarks([]);
    } catch {}
    setConfirmClear(false);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker">Saved</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">Your reading list</h1>
          <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
            Stories you saved. They stay in this browser only.
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className={`text-xs font-medium transition-colors ${
              confirmClear ? "text-signal" : "text-ink-3 hover:text-ink"
            }`}
          >
            {confirmClear ? "Click again to remove all" : "Remove all"}
          </button>
        )}
      </header>

      {loaded && bookmarks.length === 0 ? (
        <div className="border-t-2 border-edge pt-8">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="font-serif text-3xl leading-tight text-ink">Nothing saved yet.</p>
              <p className="mt-3 max-w-prose text-ink-2">
                Use <span className="text-xs font-medium text-ink">Save</span> on any story to keep
                it here for later. Saved stories don&apos;t sync between devices.
              </p>
              <Link href="/" className="btn-primary mt-6">
                Go to latest stories
              </Link>
            </div>
            <ol className="hidden space-y-3 md:col-span-5 md:block" aria-hidden>
              {[0.9, 0.7, 0.8].map((w, i) => (
                <li key={i} className="border-t border-rule pt-3">
                  <div className="h-2.5 w-16 bg-paper-sunk" />
                  <div className="mt-2 h-4 bg-paper-sunk" style={{ width: `${w * 100}%` }} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <section aria-label="Saved stories">
          <div className="section-head">
            <h2 className="section-title">Saved stories</h2>
            <span className="text-xs font-medium text-ink-3 tabular">{bookmarks.length}</span>
          </div>
          <ol className="border-b border-rule">
            {bookmarks.map((item) => (
              <li
                key={item.id}
                className="group grid grid-cols-[4rem_1fr] gap-x-5 border-t border-rule py-5 first:border-t-0 sm:grid-cols-[5.5rem_1fr_auto]"
              >
                <span className="font-mono text-xs leading-5 text-ink-3 tabular">
                  {item.savedAt
                    ? new Date(item.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                    : "-"}
                </span>
                <div className="min-w-0">
                  <p className="kicker flex flex-wrap gap-x-3">
                    {item.country && <span>{item.country}</span>}
                    {item.category && <span>{item.category}</span>}
                  </p>
                  <Link href={`/article/${item.id}`}>
                    <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-ink decoration-1 underline-offset-[5px] group-hover:underline">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="mt-1.5 text-sm text-ink-3">{item.sourceName}</p>
                </div>
                <div className="col-start-2 mt-3 flex items-start gap-4 text-xs font-medium sm:col-start-auto sm:mt-1">
                  <Link href={`/article/${item.id}`} className="text-ink hover:underline hover:underline-offset-4">
                    Read
                  </Link>
                  <button onClick={() => remove(item.id)} className="text-ink-3 hover:text-signal" aria-label={`Remove ${item.title}`}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

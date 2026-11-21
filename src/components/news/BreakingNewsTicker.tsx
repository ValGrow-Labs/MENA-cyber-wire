"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ChevronRight, Pause, Play } from "lucide-react";
import { NewsArticle } from "@/types/news";

export default function BreakingNewsTicker() {
  const [breakingItems, setBreakingItems] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch("/api/news?status=SIGNAL&sortBy=latest")
      .then((res) => res.json())
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBreakingItems(res.data.slice(0, 6));
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  useEffect(() => {
    if (isPaused || breakingItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingItems.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, breakingItems.length]);

  if (breakingItems.length === 0) {
    return null;
  }

  const current = breakingItems[currentIndex];

  return (
    <div className="w-full bg-mist border-b border-mist-border py-2 px-4 text-xs transition-colors">
      <div className="max-w-[1480px] mx-auto flex items-center justify-between gap-3">
        {/* Coastal Tech Alert Orange Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-alert-orange text-white font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
            <Flame className="w-3 h-3 animate-pulse" />
            <span>BREAKING INTELLIGENCE</span>
          </span>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-teal" />
        </div>

        {/* Headline Ticker Item */}
        <div
          className="flex-1 min-w-0 overflow-hidden flex items-center justify-start gap-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {current.country && (
            <span className="hidden sm:inline-block font-mono text-ocean font-bold text-[11px] flex-shrink-0 bg-white px-2 py-0.5 rounded-md border border-slate-border">
              {current.country.toUpperCase()}
            </span>
          )}
          <Link
            href={`/article/${current.id}`}
            className="truncate text-slate-dark hover:text-teal font-semibold transition-colors"
          >
            {current.title}
          </Link>
          <span className="hidden lg:inline-block text-[11px] text-slate-muted flex-shrink-0">
            &middot; {current.sourceName}
          </span>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-mono text-slate-muted">
            {currentIndex + 1}/{breakingItems.length}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-slate-muted hover:text-ocean p-1 rounded-md"
            aria-label={isPaused ? "Resume ticker" : "Pause ticker"}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
          <Link
            href="/breaking"
            className="hidden sm:flex items-center gap-0.5 text-[11px] font-bold text-teal hover:text-teal-dark ml-1"
          >
            <span>Live Wire</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

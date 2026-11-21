"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Check } from "lucide-react";
import { CommunityPost } from "@/types/community";
import { LocalStore } from "@/lib/storage/local-store";

interface Props {
  post: CommunityPost;
  onPostUpdated?: (updated: CommunityPost) => void;
}

export default function CommunityPostCard({ post, onPostUpdated }: Props) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const votes = LocalStore.getUpvotedIds();
    if (votes[post.id]) {
      setUserVote(votes[post.id]);
    }
  }, [post.id]);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      LocalStore.setVote(post.id, null);
      setUserVote(null);
      setUpvotes((v) => (type === "up" ? v - 1 : v + 1));
    } else {
      const old = userVote;
      LocalStore.setVote(post.id, type);
      setUserVote(type);
      setUpvotes((v) => {
        if (old === "up" && type === "down") return v - 2;
        if (old === "down" && type === "up") return v + 2;
        return type === "up" ? v + 1 : v - 1;
      });
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/community?post=${post.id}` : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const formattedDate = new Date(post.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-border overflow-hidden hover:border-teal/40 hover:shadow-coastal transition-all">
      <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
        {/* Reddit-style Vertical Vote Column in Coastal Tech styling */}
        <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-mist border border-mist-border flex-shrink-0">
          <button
            onClick={() => handleVote("up")}
            aria-label="Upvote post"
            className={`p-1 rounded-lg transition-colors ${
              userVote === "up" ? "text-teal bg-teal-light" : "text-slate-muted hover:text-teal"
            }`}
          >
            <ArrowBigUp className={`w-5 h-5 ${userVote === "up" ? "fill-teal text-teal" : ""}`} />
          </button>
          <span className="text-xs font-bold font-mono text-ocean py-0.5">
            {upvotes}
          </span>
          <button
            onClick={() => handleVote("down")}
            aria-label="Downvote post"
            className={`p-1 rounded-lg transition-colors ${
              userVote === "down" ? "text-ocean bg-slate-subtle" : "text-slate-muted hover:text-ocean"
            }`}
          >
            <ArrowBigDown className={`w-5 h-5 ${userVote === "down" ? "fill-ocean text-ocean" : ""}`} />
          </button>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Author & Context Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-muted mb-1.5">
            <span className="font-bold text-ocean">
              {post.author.name}
            </span>
            <span className="font-mono text-[11px] text-teal">
              {post.author.handle}
            </span>
            {post.author.badge && (
              <span className="px-2 py-0.5 text-[9px] font-semibold rounded-md bg-mist text-ocean border border-mist-border">
                {post.author.badge}
              </span>
            )}
            <span>&middot;</span>
            <span className="text-ocean font-bold">{post.country}</span>
            <span>&middot;</span>
            <span>{formattedDate}</span>

            {/* DEMO Tag clearly labeled */}
            {post.isDemo && (
              <span className="ml-auto px-2 py-0.5 text-[9px] font-mono uppercase bg-ice border border-slate-border text-slate-muted rounded-md">
                Sample Community Post
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/community?post=${post.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-ocean hover:text-teal transition-colors leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Body */}
          <p className="mt-2 text-xs sm:text-sm text-slate-dark leading-relaxed">
            {post.body}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-ice text-slate-dark border border-slate-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="mt-4 pt-3 border-t border-slate-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Link
                href={`/community?post=${post.id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-muted hover:text-teal transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-teal" />
                <span>{post.commentsCount} Comments</span>
              </Link>

              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-slate-muted hover:text-ocean transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? "Link Copied" : "Share"}</span>
              </button>
            </div>

            <span className="text-[11px] font-semibold text-ocean bg-mist px-2.5 py-0.5 rounded-md border border-mist-border">
              {post.topic}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

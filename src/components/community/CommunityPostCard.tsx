"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { CommunityPost } from "@/types/community";
import { LocalStore } from "@/lib/storage/local-store";

interface Props {
  post: CommunityPost;
  onPostUpdated?: (updated: CommunityPost) => void;
  onOpen?: () => void;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !["of", "and", "&"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Discussion row: vote column · square monogram · title, body, meta. */
export default function CommunityPostCard({ post, onOpen }: Props) {
  const [score, setScore] = useState(post.upvotes);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const votes = LocalStore.getUpvotedIds();
    if (votes[post.id]) setUserVote(votes[post.id]);
  }, [post.id]);

  const vote = (type: "up" | "down") => {
    if (userVote === type) {
      LocalStore.setVote(post.id, null);
      setUserVote(null);
      setScore((v) => (type === "up" ? v - 1 : v + 1));
    } else {
      const old = userVote;
      LocalStore.setVote(post.id, type);
      setUserVote(type);
      setScore((v) => {
        if (old === "up" && type === "down") return v - 2;
        if (old === "down" && type === "up") return v + 2;
        return type === "up" ? v + 1 : v - 1;
      });
    }
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community?post=${post.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const date = new Date(post.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const meta = "text-xs font-medium text-ink-3 transition-colors hover:text-ink";

  return (
    <article className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-rule py-6 sm:grid-cols-[3rem_1fr]">
      <div className="flex flex-col items-center gap-0.5 pt-0.5" aria-label="Votes">
        <button
          onClick={() => vote("up")}
          aria-label="Upvote"
          aria-pressed={userVote === "up"}
          className={`p-0.5 transition-colors ${userVote === "up" ? "text-ink" : "text-ink-4 hover:text-ink"}`}
        >
          <ChevronUp className="h-5 w-5" strokeWidth={userVote === "up" ? 2.25 : 1.5} />
        </button>
        <span className="font-mono text-xs text-ink tabular">{score}</span>
        <button
          onClick={() => vote("down")}
          aria-label="Downvote"
          aria-pressed={userVote === "down"}
          className={`p-0.5 transition-colors ${userVote === "down" ? "text-ink" : "text-ink-4 hover:text-ink"}`}
        >
          <ChevronDown className="h-5 w-5" strokeWidth={userVote === "down" ? 2.25 : 1.5} />
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-ink font-mono text-2xs font-medium text-paper"
            aria-hidden
          >
            {initials(post.author.name) || "?"}
          </span>
          <div className="min-w-0 text-sm leading-tight">
            <span className="block truncate text-ink">{post.author.name}</span>
            <span className="block text-xs font-medium text-ink-3">
              {post.author.role} · {post.country} · <span className="tabular">{date}</span>
            </span>
          </div>
          {post.isPinned && <span className="tag ml-auto shrink-0 border border-edge px-1.5 py-0.5 text-ink">Pinned</span>}
        </div>

        <button onClick={onOpen} className="mt-3 block text-left">
          <h2 className="font-serif text-xl font-semibold leading-snug tracking-[-0.01em] text-ink decoration-1 underline-offset-[5px] group-hover:underline">
            {post.title}
          </h2>
        </button>

        <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-3">{post.body}</p>

        {post.tags?.length > 0 && (
          <p className="mt-3 font-mono text-2xs text-ink-3">{post.tags.map((t) => `#${t}`).join("  ")}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="kicker text-ink">{post.topic}</span>
          <button onClick={onOpen} className={meta}>
            <span className="tabular">{post.commentsCount}</span> {post.commentsCount === 1 ? "reply" : "replies"}
          </button>
          <button onClick={share} className={meta}>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    </article>
  );
}

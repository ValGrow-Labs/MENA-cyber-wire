"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X, Search } from "lucide-react";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { SEED_COMMUNITY_POSTS } from "@/lib/community/seed-community";
import { CommunityPost, CommunityComment } from "@/types/community";

const TOPICS = [
  "Threat Intelligence",
  "Compliance & Governance",
  "Industrial Control Systems",
  "Research & Open Source",
  "Incident Response",
];

const COUNTRIES = ["Saudi Arabia", "United Arab Emirates", "Qatar", "Egypt", "Kuwait", "Regional MENA"];

function CommunityPageContent() {
  const searchParams = useSearchParams();
  const highlightedPostId = searchParams.get("post");

  const [posts, setPosts] = useState<CommunityPost[]>(SEED_COMMUNITY_POSTS);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"hot" | "new">("hot");

  const [composerOpen, setComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTopic, setNewTopic] = useState(TOPICS[0]);
  const [newCountry, setNewCountry] = useState(COUNTRIES[0]);
  const [newTags, setNewTags] = useState("");
  const [formErrors, setFormErrors] = useState<{ title?: string; body?: string }>({});

  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    fetch("/api/community")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.data) && d.data.length > 0) {
          setPosts(d.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (highlightedPostId) {
      const match = posts.find((p) => p.id === highlightedPostId);
      if (match) setActivePost(match);
    }
  }, [highlightedPostId, posts]);

  useEffect(() => {
    if (!activePost) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setActivePost(null);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [activePost]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { title?: string; body?: string } = {};
    if (newTitle.trim().length < 10) errors.title = "Write a title of at least 10 characters.";
    if (newBody.trim().length < 30) errors.body = "Add some context: at least 30 characters.";
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    const created: CommunityPost = {
      id: `user-post-${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      topic: newTopic,
      country: newCountry,
      author: { name: "You", handle: "@you", role: "Member", verified: false },
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      commentsCount: 0,
      tags: newTags.split(",").map((t) => t.trim().replace(/^#/, "")).filter(Boolean),
      isDemo: false,
      comments: [],
    };

    setPosts([created, ...posts]);
    setComposerOpen(false);
    setNewTitle("");
    setNewBody("");
    setNewTags("");
    setSortBy("new");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost) return;
    if (!commentText.trim()) {
      setCommentError("Write a reply before posting.");
      return;
    }
    setCommentError("");

    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      postId: activePost.id,
      author: { name: "You", handle: "@you", role: "Member", verified: false },
      timestamp: new Date().toISOString(),
      content: commentText.trim(),
      upvotes: 0,
    };

    const updated = {
      ...activePost,
      commentsCount: activePost.commentsCount + 1,
      comments: [...(activePost.comments || []), newComment],
    };
    setActivePost(updated);
    setPosts(posts.map((p) => (p.id === activePost.id ? updated : p)));
    setCommentText("");
  };

  const filtered = posts.filter((p) => {
    if (selectedTopic !== "all" && p.topic !== selectedTopic) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.title.toLowerCase().includes(s) || p.body.toLowerCase().includes(s) || p.country.toLowerCase().includes(s);
    }
    return true;
  });

  if (sortBy === "hot") {
    filtered.sort((a, b) => b.upvotes * 2 + b.commentsCount * 3 - (a.upvotes * 2 + a.commentsCount * 3));
  } else {
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker">Community</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">Practitioner discussions</h1>
          <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
            Questions and field notes from people defending networks in the region.
          </p>
        </div>
        <button onClick={() => setComposerOpen((v) => !v)} aria-expanded={composerOpen} className="btn-primary">
          {composerOpen ? "Close" : "Start a discussion"}
        </button>
      </header>

      {composerOpen && (
        <form onSubmit={handleCreatePost} noValidate className="animate-rise border-t-2 border-edge pt-5">
          <h2 className="section-title">New discussion</h2>
          <div className="mt-5 grid gap-5">
            <div>
              <label htmlFor="post-title" className="kicker mb-1.5 block text-ink">Title</label>
              <input
                id="post-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="How are teams applying aeCERT guidance to healthcare cloud workloads?"
                aria-invalid={!!formErrors.title}
                className={`field ${formErrors.title ? "border-signal" : ""}`}
              />
              {formErrors.title && <p className="mt-1.5 text-sm text-signal">{formErrors.title}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="post-topic" className="kicker mb-1.5 block text-ink">Topic</label>
                <select id="post-topic" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} className="field">
                  {TOPICS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="post-country" className="kicker mb-1.5 block text-ink">Country</label>
                <select id="post-country" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} className="field">
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="post-body" className="kicker mb-1.5 block text-ink">Context</label>
              <textarea
                id="post-body"
                rows={5}
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="What are you seeing, what have you tried, and what do you want to know?"
                aria-invalid={!!formErrors.body}
                className={`field ${formErrors.body ? "border-signal" : ""}`}
              />
              {formErrors.body && <p className="mt-1.5 text-sm text-signal">{formErrors.body}</p>}
            </div>

            <div>
              <label htmlFor="post-tags" className="kicker mb-1.5 block text-ink">Tags</label>
              <input
                id="post-tags"
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="NCA, CloudSecurity, IncidentResponse"
                className="field"
              />
              <p className="mt-1.5 text-sm text-ink-3">Separate tags with commas.</p>
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary">Post discussion</button>
              <button type="button" onClick={() => setComposerOpen(false)} className="text-sm text-ink-3 hover:text-ink">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <section aria-label="Discussions">
        <div className="section-head items-end">
          <div role="tablist" aria-label="Sort" className="-mb-3 flex gap-5">
            {(["hot", "new"] as const).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={sortBy === s}
                onClick={() => setSortBy(s)}
                className={`border-b-[3px] pb-2.5 font-serif text-lg transition-colors ${
                  sortBy === s ? "border-signal text-ink" : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {s === "hot" ? "Most active" : "Newest"}
              </button>
            ))}
          </div>
          <label className="flex w-full max-w-[14rem] items-center border-b border-rule focus-within:border-ink">
            <Search className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.5} />
            <span className="sr-only">Filter discussions</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter discussions"
              className="w-full bg-transparent px-2 py-1.5 text-sm text-ink placeholder:text-ink-4 focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-3 flex gap-x-5 gap-y-2 overflow-x-auto pb-1 text-xs font-medium [scrollbar-width:none]">
          {["all", ...TOPICS].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              aria-pressed={selectedTopic === t}
              className={`shrink-0 ${
                selectedTopic === t ? "text-ink underline decoration-1 underline-offset-4" : "text-ink-3 hover:text-ink"
              }`}
            >
              {t === "all" ? "All topics" : t}
            </button>
          ))}
        </div>

        <div className="mt-4 border-b border-rule">
          {filtered.length === 0 ? (
            <div className="border-t border-rule py-12">
              <p className="font-serif text-2xl text-ink">No discussions match.</p>
              <p className="mt-2 text-ink-2">Try another topic, or start the conversation yourself.</p>
            </div>
          ) : (
            filtered.map((post) => (
              <CommunityPostCard key={post.id} post={post} onOpen={() => setActivePost(post)} />
            ))
          )}
        </div>
      </section>

      {/* Thread slide-over */}
      {activePost && (
        <div className="fixed inset-0 z-modal flex justify-end" role="dialog" aria-modal="true" aria-labelledby="thread-title">
          <button className="flex-1 bg-ink/30" aria-label="Close discussion" onClick={() => setActivePost(null)} />
          <div className="flex h-full w-full max-w-xl animate-rise flex-col border-l border-edge bg-paper">
            <div className="flex items-start justify-between gap-4 border-b border-edge px-6 py-5">
              <div className="min-w-0">
                <p className="kicker">{activePost.country} · {activePost.topic}</p>
                <h2 id="thread-title" className="mt-2 font-serif text-2xl font-semibold leading-tight text-ink">
                  {activePost.title}
                </h2>
              </div>
              <button onClick={() => setActivePost(null)} className="p-1 text-ink-3 hover:text-ink" aria-label="Close">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-sm text-ink-3">
                {activePost.author.name} ·{" "}
                <span className="text-xs font-medium tabular">
                  {new Date(activePost.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink-2">{activePost.body}</p>

              <div className="mt-8 border-t-2 border-edge pt-2.5">
                <p className="kicker text-ink">
                  Replies <span className="tabular">({activePost.comments?.length || 0})</span>
                </p>
              </div>
              {activePost.comments && activePost.comments.length > 0 ? (
                <ol>
                  {activePost.comments.map((c) => (
                    <li key={c.id} className="border-b border-rule py-4">
                      <p className="flex justify-between gap-3 text-sm">
                        <span className="text-ink">{c.author.name} <span className="text-ink-3">· {c.author.role}</span></span>
                        <span className="font-mono text-2xs text-ink-3 tabular">
                          {new Date(c.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{c.content}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="py-4 text-ink-3">No replies yet.</p>
              )}
            </div>

            <form onSubmit={handleAddComment} noValidate className="border-t border-edge px-6 py-4">
              <label htmlFor="reply" className="kicker mb-1.5 block text-ink">Your reply</label>
              <div className="flex gap-3">
                <input
                  id="reply"
                  type="text"
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    if (commentError) setCommentError("");
                  }}
                  placeholder="Share what worked, or what didn't"
                  aria-invalid={!!commentError}
                  className={`field ${commentError ? "border-signal" : ""}`}
                />
                <button type="submit" className="btn-primary shrink-0">Reply</button>
              </div>
              {commentError && <p className="mt-1.5 text-sm text-signal">{commentError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CommunityPageContent />
    </Suspense>
  );
}

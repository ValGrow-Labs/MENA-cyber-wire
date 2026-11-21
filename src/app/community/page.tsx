"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { SEED_COMMUNITY_POSTS } from "@/lib/community/seed-community";
import { CommunityPost, CommunityComment } from "@/types/community";
import { MessageSquare, Plus, Search, Flame, Clock, Send, ShieldCheck, X } from "lucide-react";

function CommunityPageContent() {
  const searchParams = useSearchParams();
  const highlightedPostId = searchParams.get("post");

  const [posts, setPosts] = useState<CommunityPost[]>(SEED_COMMUNITY_POSTS);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"hot" | "new">("hot");

  // Create post modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTopic, setNewTopic] = useState("Threat Intelligence");
  const [newCountry, setNewCountry] = useState("Saudi Arabia");
  const [newTags, setNewTags] = useState("");

  // Comment modal / drawer state
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (highlightedPostId) {
      const match = posts.find((p) => p.id === highlightedPostId);
      if (match) setActivePost(match);
    }
  }, [highlightedPostId, posts]);

  const topics = [
    "all",
    "Threat Intelligence",
    "Compliance & Governance",
    "Industrial Control Systems",
    "Research & Open Source",
    "Incident Response",
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const created: CommunityPost = {
      id: `user-post-${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      topic: newTopic,
      country: newCountry,
      author: {
        name: "Security Practitioner",
        handle: "@analyst_mena",
        role: "SOC Analyst",
        verified: false,
      },
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
    setIsModalOpen(false);
    setNewTitle("");
    setNewBody("");
    setNewTags("");
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activePost) return;

    const newComment: CommunityComment = {
      id: `comm-${Date.now()}`,
      postId: activePost.id,
      author: {
        name: "Security Practitioner",
        handle: "@practitioner_local",
        role: "SOC Analyst",
        verified: false,
      },
      timestamp: new Date().toISOString(),
      content: commentText.trim(),
      upvotes: 1,
    };

    const updatedPost = {
      ...activePost,
      commentsCount: activePost.commentsCount + 1,
      comments: [...(activePost.comments || []), newComment],
    };

    setActivePost(updatedPost);
    setPosts(posts.map((p) => (p.id === activePost.id ? updatedPost : p)));
    setCommentText("");
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedTopic !== "all" && p.topic !== selectedTopic) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(s) ||
        p.body.toLowerCase().includes(s) ||
        p.country.toLowerCase().includes(s)
      );
    }
    return true;
  });

  if (sortBy === "hot") {
    filteredPosts.sort((a, b) => b.upvotes * 2 + b.commentsCount * 3 - (a.upvotes * 2 + a.commentsCount * 3));
  } else {
    filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return (
    <div className="space-y-6">
      {/* Community Banner in Coastal Tech styling */}
      <div className="p-6 rounded-2xl bg-white border border-slate-border shadow-coastal-card flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-teal-light text-teal">
              <MessageSquare className="w-4 h-4 text-teal" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal">
              Practitioner Intelligence Exchange
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-ocean">
            Practitioner Discussions & Tradecraft
          </h1>
          <p className="text-xs text-slate-muted max-w-xl leading-relaxed">
            A regional intelligence exchange for CISOs, SOC analysts, and security engineers. Share verified indicators, regulatory compliance practices (NCA ECC), and defensive tradecraft.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal text-white font-bold text-xs hover:bg-teal-dark transition-all shadow-coastal"
        >
          <Plus className="w-4 h-4" />
          <span>Start Discussion</span>
        </button>
      </div>

      {/* Topics & Sort Controls */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                  selectedTopic === t
                    ? "bg-teal text-white shadow-coastal"
                    : "text-slate-dark hover:bg-mist hover:text-teal"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSortBy("hot")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
                sortBy === "hot" ? "bg-ocean text-white shadow-xs" : "text-slate-muted hover:text-ocean"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-desert" />
              <span>Hot</span>
            </button>
            <button
              onClick={() => setSortBy("new")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${
                sortBy === "new" ? "bg-ocean text-white shadow-xs" : "text-slate-muted hover:text-ocean"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-desert" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex items-center pt-2 border-t border-slate-border">
          <Search className="w-4 h-4 absolute left-3 text-slate-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions by topic, keyword, or country..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-ice border border-slate-border text-slate-dark placeholder-slate-muted focus:outline-hidden focus:border-teal"
          />
        </div>
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} onClick={() => setActivePost(post)} className="cursor-pointer">
            <CommunityPostCard post={post} />
          </div>
        ))}
      </div>

      {/* Discussion Detail & Threading Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-ocean-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl border border-slate-border shadow-coastal-elevated flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-border flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal">
                  {activePost.country} &middot; {activePost.topic}
                </span>
                <h3 className="text-base font-bold text-ocean line-clamp-1">
                  {activePost.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePost(null)}
                className="p-1.5 text-slate-muted hover:text-slate-dark rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content & Thread Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="p-4 rounded-xl bg-mist border border-mist-border">
                <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                  {activePost.body}
                </p>
              </div>

              {/* Comments Thread */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block">
                  Practitioner Responses ({activePost.comments?.length || 0})
                </span>

                {activePost.comments && activePost.comments.length > 0 ? (
                  activePost.comments.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-ice border border-slate-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-muted">
                        <span className="font-bold text-ocean">
                          {c.author.name} ({c.author.role})
                        </span>
                        <span className="font-mono">{new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-xs text-slate-dark leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-muted italic">No comments yet. Be the first to share tradecraft.</p>
                )}
              </div>
            </div>

            {/* Comment Submission Bar */}
            <form onSubmit={handleAddComment} className="p-3 border-t border-slate-border bg-ice flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share technical observations or remediation tips..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-teal text-white hover:bg-teal-dark shadow-coastal flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Start Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-ocean-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-border shadow-coastal-elevated p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-border">
              <h3 className="text-base font-bold text-ocean">
                Start Community Discussion
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-muted hover:text-slate-dark">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-ocean block mb-1">
                  Discussion Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Recommendations for implementing aeCERT guidelines for healthcare cloud?"
                  className="w-full px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-ocean block mb-1">
                    Topic
                  </label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
                  >
                    <option>Threat Intelligence</option>
                    <option>Compliance & Governance</option>
                    <option>Industrial Control Systems</option>
                    <option>Research & Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-ocean block mb-1">
                    Country
                  </label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
                  >
                    <option>Saudi Arabia</option>
                    <option>United Arab Emirates</option>
                    <option>Qatar</option>
                    <option>Egypt</option>
                    <option>Kuwait</option>
                    <option>Regional MENA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-ocean block mb-1">
                  Discussion Context / Question
                </label>
                <textarea
                  required
                  rows={4}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Provide technical context, observations, or architecture questions..."
                  className="w-full px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
                />
              </div>

              <div>
                <label className="font-bold text-ocean block mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. NCA, CloudSecurity, IncidentResponse"
                  className="w-full px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-muted hover:text-slate-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal text-white hover:bg-teal-dark shadow-coastal"
                >
                  Post Discussion
                </button>
              </div>
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

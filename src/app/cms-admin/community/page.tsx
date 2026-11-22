"use client";

import { useEffect, useState } from "react";
import { MessagesSquare, Plus, Pin, EyeOff, Trash2, Flag, CheckCircle2 } from "lucide-react";
import { CMSCommunityPost } from "@/types/cms";
import { useAdmin } from "../layout";
import ConfirmModal from "@/components/cms/ConfirmModal";

export default function CMSCommunityPage() {
  const { notify } = useAdmin();
  const [posts, setPosts] = useState<CMSCommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  // New topic modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("Compliance & Governance");
  const [country, setCountry] = useState("Saudi Arabia");
  const [tagsInput, setTagsInput] = useState("PDPL, SOC, Compliance");

  const [deleteTarget, setDeleteTarget] = useState<CMSCommunityPost | null>(null);

  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/community");
      const d = await res.json();
      if (d.success) setPosts(d.data);
    } catch {
      notify("Failed to fetch community discussions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      const res = await fetch("/api/cms/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          topic,
          country,
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const d = await res.json();
      if (d.success) {
        notify("Editorial discussion prompt created!", "success");
        setIsModalOpen(false);
        setTitle("");
        setBody("");
        fetchCommunity();
      }
    } catch {
      notify("Failed to create prompt", "error");
    }
  };

  const handleUpdateStatus = async (post: CMSCommunityPost, status: "ACTIVE" | "FLAGGED" | "HIDDEN" | "DELETED") => {
    try {
      const res = await fetch(`/api/cms/community/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moderationStatus: status }),
      });
      if (res.ok) {
        notify(`Post marked as ${status}`, "info");
        fetchCommunity();
      }
    } catch {}
  };

  const handleTogglePin = async (post: CMSCommunityPost) => {
    try {
      const res = await fetch(`/api/cms/community/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !post.isPinned }),
      });
      if (res.ok) {
        notify(`Post ${!post.isPinned ? "pinned" : "unpinned"}`, "info");
        fetchCommunity();
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/community/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Post deleted by moderator", "success");
        setDeleteTarget(null);
        fetchCommunity();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Community Moderation
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Review community posts, pin discussions, and moderate comments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>New Post</span>
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="p-12 text-center text-xs text-[#707070]">Loading discussions...</p>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-12 text-center text-xs text-[#707070]">
            No community posts currently recorded. Create an editorial prompt above to initiate discussion.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`rounded-lg border p-5 space-y-3 transition-colors ${
                post.moderationStatus === "DELETED"
                  ? "border-[#D63838]/30 bg-[#151515]/40 opacity-40"
                  : post.moderationStatus === "HIDDEN"
                  ? "border-[#707070]/30 bg-[#151515]/60 opacity-60"
                  : "border-[#2B2B2B] bg-[#151515]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.isPinned && (
                      <span className="inline-flex items-center gap-1 rounded bg-[#D63838] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase">
                        <Pin size={10} /> PINNED
                      </span>
                    )}
                    <span className="rounded bg-[#202020] px-2 py-0.5 font-mono text-[10px] text-[#A1A1A1]">
                      {post.topic}
                    </span>
                    <span className="rounded bg-[#087E8B]/15 px-2 py-0.5 font-mono text-[10px] text-[#087E8B]">
                      {post.country}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                        post.moderationStatus === "ACTIVE"
                          ? "bg-[#27AE60]/15 text-[#27AE60]"
                          : post.moderationStatus === "FLAGGED"
                          ? "bg-[#F2B45B]/15 text-[#F2B45B]"
                          : "bg-[#D63838]/15 text-[#D63838]"
                      }`}
                    >
                      {post.moderationStatus}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">{post.title}</h3>
                  <p className="text-xs text-[#A1A1A1] leading-relaxed">{post.body}</p>

                  <p className="font-mono text-[10px] text-[#707070]">
                    Posted by {post.authorName} ({post.authorRole}) &middot; {post.commentsCount || 0} comments &middot; {new Date(post.timestamp).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePin(post)}
                    className={`rounded p-1.5 ${post.isPinned ? "text-[#D63838]" : "text-[#707070]"} hover:bg-[#202020]`}
                    title={post.isPinned ? "Unpin post" : "Pin post"}
                  >
                    <Pin size={15} />
                  </button>

                  {post.moderationStatus !== "ACTIVE" && (
                    <button
                      onClick={() => handleUpdateStatus(post, "ACTIVE")}
                      className="rounded p-1.5 text-[#27AE60] hover:bg-[#202020]"
                      title="Mark Active"
                    >
                      <CheckCircle2 size={15} />
                    </button>
                  )}

                  {post.moderationStatus !== "HIDDEN" && (
                    <button
                      onClick={() => handleUpdateStatus(post, "HIDDEN")}
                      className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020]"
                      title="Hide from public"
                    >
                      <EyeOff size={15} />
                    </button>
                  )}

                  {post.moderationStatus !== "FLAGGED" && (
                    <button
                      onClick={() => handleUpdateStatus(post, "FLAGGED")}
                      className="rounded p-1.5 text-[#F2B45B] hover:bg-[#202020]"
                      title="Flag for review"
                    >
                      <Flag size={15} />
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTarget(post)}
                    className="rounded p-1.5 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                    title="Delete permanently"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreatePrompt} className="w-full max-w-lg rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">New Editorial Discussion Prompt</h3>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Prompt Title / Question</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Rolling out FIDO2 security keys to staff who mostly work in Arabic"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Context & Discussion Guidance</label>
              <textarea
                rows={4}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Detailed prompt providing background context and specific questions for practitioners..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                >
                  <option value="Threat Intelligence">Threat Intelligence</option>
                  <option value="Compliance & Governance">Compliance & Governance</option>
                  <option value="Industrial Control Systems">Industrial Control Systems</option>
                  <option value="Research & Open Source">Research & Open Source</option>
                  <option value="Incident Response">Incident Response</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Country Focus</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                >
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Regional MENA">Regional MENA</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#2B2B2B]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded border border-[#2B2B2B] px-3 py-1.5 text-xs text-[#A1A1A1]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded bg-[#D63838] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Broadcast Topic
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Community Post?"
        message={`Delete discussion topic "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Save, CheckCircle2, Star, MoveUp, MoveDown, Eye } from "lucide-react";
import { useAdmin } from "../AdminContext";

export default function CMSFeaturedStoriesPage() {
  const { notify } = useAdmin();
  const [data, setData] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [leadStoryId, setLeadStoryId] = useState("");
  const [topStoryIds, setTopStoryIds] = useState<string[]>([]);
  const [secondaryStoryIds, setSecondaryStoryIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/featured");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          setArticles(json.data.articles || []);
          setLeadStoryId(json.data.leadStoryId || "");
          setTopStoryIds(json.data.topStoryIds || []);
          setSecondaryStoryIds(json.data.secondaryStoryIds || []);
        }
      }
    } catch {
      notify("Failed to fetch featured configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadStoryId,
          topStoryIds,
          secondaryStoryIds,
        }),
      });
      const json = await res.json();
      if (json.success) {
        notify("Featured homepage placements successfully updated!", "success");
      } else {
        notify(json.error || "Save failed", "error");
      }
    } catch {
      notify("Error saving featured stories", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707070]">Loading featured curation...</div>;
  }

  const leadStory = articles.find((a) => a.id === leadStoryId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Featured Stories
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Select the lead story and featured articles displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#b02c2c] disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? "Saving..." : "Save Featured Placement"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Lead Story Selection */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-lg border border-[#F2B45B]/30 bg-[#151515] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-[#F2B45B]" />
              <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">Lead Centerpiece Story</h3>
            </div>
            <p className="text-xs text-[#A1A1A1]">
              The lead story receives prime hero treatment at the top center of the homepage.
            </p>

            <select
              value={leadStoryId}
              onChange={(e) => setLeadStoryId(e.target.value)}
              className="w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:border-[#D63838] focus:outline-none"
            >
              <option value="">-- Select Lead Story --</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  [{a.category}] {a.headline}
                </option>
              ))}
            </select>

            {leadStory && (
              <div className="rounded border border-[#2B2B2B] bg-[#191919] p-4 text-xs space-y-2">
                <span className="font-mono text-[10px] text-[#087E8B] uppercase">{leadStory.category} &middot; {leadStory.country || "Regional"}</span>
                <h4 className="font-serif text-sm font-semibold text-[#F5F5F5]">{leadStory.headline}</h4>
                <p className="font-mono text-[11px] text-[#707070]">
                  Published: {new Date(leadStory.publishedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Top Stories Multi-Select */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">Top Stories (Hero Column)</h3>
            <p className="text-xs text-[#A1A1A1]">Stories featured immediately adjacent to the lead story.</p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {articles.map((a) => {
                const isSelected = topStoryIds.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={`flex items-center gap-3 rounded border p-2.5 text-xs cursor-pointer transition-colors ${
                      isSelected ? "border-[#087E8B] bg-[#087E8B]/10 text-[#F5F5F5]" : "border-[#2B2B2B] bg-[#191919] text-[#A1A1A1]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) setTopStoryIds([...topStoryIds, a.id]);
                        else setTopStoryIds(topStoryIds.filter((id) => id !== a.id));
                      }}
                      className="rounded border-[#2B2B2B] bg-[#0B0B0B] text-[#087E8B]"
                    />
                    <span className="flex-1 truncate">{a.headline}</span>
                    <span className="font-mono text-[10px] text-[#707070]">{a.category}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Secondary Featured Stories */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">Secondary Highlighted Columns</h3>
            <p className="text-xs text-[#A1A1A1]">Stories pinned in secondary blocks across homepage sections.</p>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {articles.map((a) => {
                const isSelected = secondaryStoryIds.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={`flex items-center gap-3 rounded border p-2.5 text-xs cursor-pointer transition-colors ${
                      isSelected ? "border-[#D63838] bg-[#D63838]/10 text-[#F5F5F5]" : "border-[#2B2B2B] bg-[#191919] text-[#A1A1A1]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) setSecondaryStoryIds([...secondaryStoryIds, a.id]);
                        else setSecondaryStoryIds(secondaryStoryIds.filter((id) => id !== a.id));
                      }}
                      className="rounded border-[#2B2B2B] bg-[#0B0B0B] text-[#D63838]"
                    />
                    <span className="flex-1 truncate">{a.headline}</span>
                    <span className="font-mono text-[10px] text-[#707070]">{a.category}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

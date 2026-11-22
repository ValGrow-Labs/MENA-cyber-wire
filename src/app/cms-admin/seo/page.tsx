"use client";

import { useEffect, useState } from "react";
import { Search, Save, Globe } from "lucide-react";
import { CMSSEOSettings } from "@/types/cms";
import { useAdmin } from "../layout";

export default function CMSSEOPage() {
  const { notify } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [defaultTitle, setDefaultTitle] = useState("");
  const [titleTemplate, setTitleTemplate] = useState("%s · MENA Cyber Wire");
  const [defaultDescription, setDefaultDescription] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [defaultOgImage, setDefaultOgImage] = useState("");
  const [canonicalBaseUrl, setCanonicalBaseUrl] = useState("https://menacyberwire.com");
  const [twitterHandle, setTwitterHandle] = useState("@menacyberwire");
  const [robotsTxtContent, setRobotsTxtContent] = useState("");

  useEffect(() => {
    fetch("/api/cms/seo")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setDefaultTitle(d.data.defaultTitle || "");
          setTitleTemplate(d.data.titleTemplate || "%s · MENA Cyber Wire");
          setDefaultDescription(d.data.defaultDescription || "");
          setKeywordsInput((d.data.keywords || []).join(", "));
          setDefaultOgImage(d.data.defaultOgImage || "");
          setCanonicalBaseUrl(d.data.canonicalBaseUrl || "https://menacyberwire.com");
          setTwitterHandle(d.data.twitterHandle || "@menacyberwire");
          setRobotsTxtContent(d.data.robotsTxtContent || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<CMSSEOSettings> = {
        defaultTitle,
        titleTemplate,
        defaultDescription,
        keywords: keywordsInput.split(",").map((k) => k.trim()).filter(Boolean),
        defaultOgImage,
        canonicalBaseUrl,
        twitterHandle,
        robotsTxtContent,
      };

      const res = await fetch("/api/cms/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (d.success) {
        notify("Global SEO & Open Graph settings saved!", "success");
      }
    } catch {
      notify("Failed to save SEO settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707070]">Loading SEO settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            SEO Settings
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Configure canonical tags, Open Graph previews, and robots indexing directives.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-[#D63838] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#b02c2c] disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
            Global Search Appearance
          </h3>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
              Default Meta Title
            </label>
            <input
              type="text"
              required
              value={defaultTitle}
              onChange={(e) => setDefaultTitle(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                Title Template Pattern
              </label>
              <input
                type="text"
                value={titleTemplate}
                onChange={(e) => setTitleTemplate(e.target.value)}
                placeholder="%s · MENA Cyber Wire"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                Canonical Base URL
              </label>
              <input
                type="url"
                value={canonicalBaseUrl}
                onChange={(e) => setCanonicalBaseUrl(e.target.value)}
                placeholder="https://menacyberwire.com"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={defaultDescription}
              onChange={(e) => setDefaultDescription(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
              Primary Search Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="MENA cybersecurity, Saudi Arabia cyber attack, NCA ECC..."
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-[#2B2B2B] pt-4">
          <h3 className="font-serif text-base font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
            Social Sharing & Open Graph
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                Default Social Sharing Image (OG Image)
              </label>
              <input
                type="url"
                value={defaultOgImage}
                onChange={(e) => setDefaultOgImage(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                Twitter / X Publisher Handle
              </label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@menacyberwire"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-[#2B2B2B] pt-4">
          <h3 className="font-serif text-base font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
            Robots.txt Directives
          </h3>
          <textarea
            rows={5}
            value={robotsTxtContent}
            onChange={(e) => setRobotsTxtContent(e.target.value)}
            className="w-full rounded border border-[#2B2B2B] bg-[#191919] p-3 font-mono text-xs text-[#F5F5F5] focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
}

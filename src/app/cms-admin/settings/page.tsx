"use client";

import { useEffect, useState } from "react";
import { Settings, Save, Clock, Globe } from "lucide-react";
import { CMSWebsiteSettings } from "@/types/cms";
import { useAdmin } from "../AdminContext";

export default function CMSSettingsPage() {
  const { notify } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [websiteName, setWebsiteName] = useState("");
  const [websiteTagline, setWebsiteTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [editorialTimezone, setEditorialTimezone] = useState("Asia/Riyadh");
  const [breakingNewsTickerEnabled, setBreakingNewsTickerEnabled] = useState(true);
  const [threatLevelOverride, setThreatLevelOverride] = useState<any>("GUARDED");
  const [footerDisclaimer, setFooterDisclaimer] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [telegram, setTelegram] = useState("");
  const [github, setGithub] = useState("");

  useEffect(() => {
    fetch("/api/cms/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setWebsiteName(d.data.websiteName || "MENA Cyber Wire");
          setWebsiteTagline(d.data.websiteTagline || "");
          setContactEmail(d.data.contactEmail || "");
          setEditorialTimezone(d.data.editorialTimezone || "Asia/Riyadh");
          setBreakingNewsTickerEnabled(d.data.breakingNewsTickerEnabled !== false);
          setThreatLevelOverride(d.data.threatLevelOverride || "GUARDED");
          setFooterDisclaimer(d.data.footerDisclaimer || "");
          setTwitter(d.data.socialLinks?.twitter || "");
          setLinkedin(d.data.socialLinks?.linkedin || "");
          setTelegram(d.data.socialLinks?.telegram || "");
          setGithub(d.data.socialLinks?.github || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<CMSWebsiteSettings> = {
        websiteName,
        websiteTagline,
        contactEmail,
        editorialTimezone,
        breakingNewsTickerEnabled,
        threatLevelOverride,
        footerDisclaimer,
        socialLinks: { twitter, linkedin, telegram, github },
      };

      const res = await fetch("/api/cms/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (d.success) {
        notify("Website newsroom settings updated!", "success");
      } else {
        notify(d.error || "Save failed", "error");
      }
    } catch {
      notify("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707070]">Loading website settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Settings
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Website defaults, editorial timezone, contacts, and platform configuration.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded bg-[#D63838] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#b02c2c] disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Website Title</label>
            <input
              type="text"
              required
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Website Tagline</label>
            <input
              type="text"
              value={websiteTagline}
              onChange={(e) => setWebsiteTagline(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Editorial Intelligence Desk Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Default Editorial Timezone</label>
            <select
              value={editorialTimezone}
              onChange={(e) => setEditorialTimezone(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
            >
              <option value="Asia/Riyadh">Asia/Riyadh (AST UTC+3) — Standard</option>
              <option value="Asia/Dubai">Asia/Dubai (GST UTC+4)</option>
              <option value="Africa/Cairo">Africa/Cairo (EET UTC+2)</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Global Threat Level Override</label>
            <select
              value={threatLevelOverride}
              onChange={(e) => setThreatLevelOverride(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="ELEVATED">ELEVATED</option>
              <option value="GUARDED">GUARDED</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={breakingNewsTickerEnabled}
                onChange={(e) => setBreakingNewsTickerEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-[#2B2B2B] bg-[#191919] text-[#D63838]"
              />
              <span className="text-xs text-[#F5F5F5]">Enable Breaking News Ticker on Public Homepage</span>
            </label>
          </div>
        </div>

        <div className="border-t border-[#2B2B2B] pt-4 space-y-4">
          <h3 className="font-serif text-base font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
            Social Channels
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Twitter / X URL</label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">LinkedIn URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Telegram Intelligence Channel</label>
              <input
                type="url"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">GitHub Repository</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#2B2B2B] pt-4">
          <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
            Public Footer Disclaimer
          </label>
          <textarea
            rows={3}
            value={footerDisclaimer}
            onChange={(e) => setFooterDisclaimer(e.target.value)}
            className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
          />
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  CheckCircle2,
  Clock,
  Radio,
  Star,
  ArrowLeft,
  Image as ImageIcon,
  ShieldAlert,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  Globe2,
  Tag,
} from "lucide-react";
import { CMSArticle } from "@/types/cms";
import RichTextEditor from "./RichTextEditor";
import MediaPickerModal from "./MediaPickerModal";
import { useAdmin } from "@/app/cms-admin/AdminContext";

interface ArticleEditorFormProps {
  initialArticle?: Partial<CMSArticle>;
  isNew?: boolean;
}

const CATEGORIES = [
  "Ransomware",
  "Data Breach",
  "Critical Infrastructure",
  "Espionage & APT",
  "Vulnerability",
  "Fintech & Banking",
  "Cloud & AI",
  "Policy & Regulation",
];

const MENA_COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Egypt",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Iraq",
  "Morocco",
  "Tunisia",
  "Algeria",
  "Regional MENA",
];

export default function ArticleEditorForm({ initialArticle, isNew = false }: ArticleEditorFormProps) {
  const router = useRouter();
  const { user, notify } = useAdmin();

  // Primary fields
  const [headline, setHeadline] = useState(initialArticle?.headline || "");
  const [slug, setSlug] = useState(initialArticle?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialArticle?.shortDescription || "");
  const [body, setBody] = useState(initialArticle?.body || "");
  const [category, setCategory] = useState<any>(initialArticle?.category || CATEGORIES[0]);
  const [country, setCountry] = useState(initialArticle?.country || "Regional MENA");
  const [region, setRegion] = useState<any>(initialArticle?.region || "Gulf");
  const [tagsInput, setTagsInput] = useState((initialArticle?.tags || ["MENA", "Cybersecurity"]).join(", "));
  const [author, setAuthor] = useState(initialArticle?.author || user?.name || "MENA Cyber Desk");
  const [sourceName, setSourceName] = useState(initialArticle?.sourceName || "MENA Cyber Wire Intelligence Desk");
  const [sourceUrl, setSourceUrl] = useState(initialArticle?.sourceUrl || "");

  // Media
  const [featuredImage, setFeaturedImage] = useState(initialArticle?.featuredImage || "");
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || "");
  const [imageCredit, setImageCredit] = useState(initialArticle?.imageCredit || "");
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  // Status & Severity
  const [editorialStatus, setEditorialStatus] = useState<any>(initialArticle?.editorialStatus || "Draft");
  const [verificationStatus, setVerificationStatus] = useState<any>(initialArticle?.verificationStatus || "SIGNAL");
  const [severity, setSeverity] = useState<any>(initialArticle?.severity || "High");
  const [scheduledFor, setScheduledFor] = useState(initialArticle?.scheduledFor || "");

  // Featured & Breaking flags
  const [isBreaking, setIsBreaking] = useState(Boolean(initialArticle?.isBreaking));
  const [isFeatured, setIsFeatured] = useState(Boolean(initialArticle?.isFeatured));
  const [featuredPosition, setFeaturedPosition] = useState<any>(initialArticle?.featuredPosition || "secondary");
  const [featuredPriority, setFeaturedPriority] = useState(initialArticle?.featuredPriority || 5);

  // Threat to Action fields
  const [whatHappened, setWhatHappened] = useState(initialArticle?.threatToAction?.whatHappened || "");
  const [whoIsAffected, setWhoIsAffected] = useState(initialArticle?.threatToAction?.whoIsAffected || "");
  const [whyItMatters, setWhyItMatters] = useState(initialArticle?.threatToAction?.whyItMatters || "");
  const [whatShouldUsersDo, setWhatShouldUsersDo] = useState(initialArticle?.threatToAction?.whatShouldUsersDo || "");
  const [defensiveActions, setDefensiveActions] = useState<string[]>(
    initialArticle?.threatToAction?.recommendedDefensiveActions || [
      "Check internet-facing edge appliances against latest KEV bulletins.",
      "Enforce phishing-resistant multi-factor authentication (MFA) across all remote access ports.",
    ]
  );
  const [newActionInput, setNewActionInput] = useState("");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialArticle?.seoDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialArticle?.canonicalUrl || "");
  const [focusKeyword, setFocusKeyword] = useState(initialArticle?.focusKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState(
    (initialArticle?.secondaryKeywords || []).join(", ")
  );
  const [noIndex, setNoIndex] = useState(Boolean(initialArticle?.noIndex));

  const [saving, setSaving] = useState(false);

  // Auto slug generator
  const handleHeadlineChange = (val: string) => {
    setHeadline(val);
    if (isNew && !slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80));
    }
  };

  const handleAddDefensiveAction = () => {
    if (!newActionInput.trim()) return;
    setDefensiveActions([...defensiveActions, newActionInput.trim()]);
    setNewActionInput("");
  };

  const handleRemoveDefensiveAction = (idx: number) => {
    setDefensiveActions(defensiveActions.filter((_, i) => i !== idx));
  };

  const handleSave = async (targetStatus?: string) => {
    if (!headline.trim()) {
      notify("Please provide an article headline.", "error");
      return;
    }

    setSaving(true);
    const finalStatus = targetStatus || editorialStatus;

    const payload: Partial<CMSArticle> = {
      headline,
      slug: slug || headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80),
      shortDescription,
      body,
      category,
      country: country === "Regional MENA" ? undefined : country,
      region,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      author,
      sourceName,
      sourceUrl,
      featuredImage: featuredImage || undefined,
      imageCaption: imageCaption || undefined,
      imageCredit: imageCredit || undefined,
      editorialStatus: finalStatus,
      verificationStatus,
      severity,
      scheduledFor: scheduledFor || undefined,
      isBreaking,
      isFeatured,
      featuredPosition: isFeatured ? featuredPosition : "none",
      featuredPriority: Number(featuredPriority),
      threatToAction: {
        whatHappened: whatHappened || shortDescription,
        whoIsAffected: whoIsAffected || (country ? `${country} enterprise networks` : "Regional organizations"),
        whyItMatters: whyItMatters || "Operational risk to affected systems.",
        whatShouldUsersDo: whatShouldUsersDo || "Apply vendor patches and audit access credentials immediately.",
        recommendedDefensiveActions: defensiveActions,
      },
      seoTitle: seoTitle || headline,
      seoDescription: seoDescription || shortDescription,
      canonicalUrl: canonicalUrl || undefined,
      focusKeyword: focusKeyword.trim() || undefined,
      secondaryKeywords: secondaryKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      noIndex,
    };

    try {
      const url = isNew ? "/api/cms/articles" : `/api/cms/articles/${initialArticle?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save article.");
      }

      notify(
        isNew ? `Article published as ${finalStatus}!` : `Article successfully updated (${finalStatus})!`,
        "success"
      );

      router.push("/cms-admin/articles");
    } catch (err: any) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2B2B2B] pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded p-2 text-[#A1A1A1] hover:bg-[#191919] hover:text-[#F5F5F5]"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span className="font-mono text-[10px] uppercase text-[#D63838]">
              {isNew ? "New Article" : "Edit Article"}
            </span>
            <h2 className="font-serif text-xl font-bold text-[#F5F5F5]">
              {headline || (isNew ? "Untitled Article" : "Edit Article")}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("Draft")}
            className="flex items-center gap-2 rounded-md border border-[#2B2B2B] bg-[#191919] px-4 py-2 text-xs font-semibold text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5] disabled:opacity-50"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("Published")}
            className="flex items-center gap-2 rounded-md bg-[#D63838] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#b02c2c] disabled:opacity-50"
          >
            <CheckCircle2 size={14} />
            <span>{saving ? "Publishing..." : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {/* Main Form Layout (2 Columns) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column (8 cols): Content & Threat-to-Action */}
        <div className="lg:col-span-8 space-y-6">
          {/* Headline & Description */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                Article Headline <span className="text-[#D63838]">*</span>
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => handleHeadlineChange(e.target.value)}
                placeholder="e.g. MuddyWater Exploits Perimeter Gateways Targeting Gulf Telecoms"
                className="mt-1.5 w-full rounded-md border border-[#2B2B2B] bg-[#191919] p-3 font-serif text-base font-semibold text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. muddywater-perimeter-gateways-gulf-telecoms"
                  className="mt-1.5 w-full rounded-md border border-[#2B2B2B] bg-[#191919] px-3 py-2 font-mono text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  Byline / Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Senior Cyber Desk Analyst"
                  className="mt-1.5 w-full rounded-md border border-[#2B2B2B] bg-[#191919] px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                Short Summary
              </label>
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary of what happened and the impact."
                className="mt-1.5 w-full rounded-md border border-[#2B2B2B] bg-[#191919] p-3 text-xs leading-relaxed text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
              />
            </div>
          </div>

          {/* Rich Body Editor */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                Article Body
              </label>
              <span className="font-mono text-[10px] text-[#707070]">Markdown format</span>
            </div>
            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Write article content..."
              minHeight="380px"
            />
          </div>

          {/* Threat-to-Action Protocol Builder */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-5">
            <div className="flex items-center gap-2 border-b border-[#2B2B2B] pb-3">
              <ShieldAlert size={18} className="text-[#D63838]" />
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#F5F5F5]">
                  Threat-to-Action Details
                </h3>
                <p className="text-[11px] text-[#A1A1A1]">
                  Tactical summary and recommended actions for readers and defenders.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  1. WHAT HAPPENED
                </label>
                <textarea
                  rows={2}
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  placeholder="Clear breakdown of incident attack vector..."
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  2. WHO IS AFFECTED
                </label>
                <textarea
                  rows={2}
                  value={whoIsAffected}
                  onChange={(e) => setWhoIsAffected(e.target.value)}
                  placeholder="Target sectors, systems, or regional entities..."
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  3. WHY IT MATTERS
                </label>
                <textarea
                  rows={2}
                  value={whyItMatters}
                  onChange={(e) => setWhyItMatters(e.target.value)}
                  placeholder="Impact and operational significance..."
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  4. WHAT SHOULD USERS / IT DO
                </label>
                <textarea
                  rows={2}
                  value={whatShouldUsersDo}
                  onChange={(e) => setWhatShouldUsersDo(e.target.value)}
                  placeholder="Immediate action directives..."
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
              </div>
            </div>

            {/* Checklist items */}
            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1] mb-2">
                DEFENSIVE REMEDIATION CHECKLIST
              </label>
              <div className="space-y-2">
                {defensiveActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs">
                    <Check size={14} className="text-[#27AE60] shrink-0" />
                    <span className="flex-1 text-[#F5F5F5]">{action}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDefensiveAction(idx)}
                      className="text-[#707070] hover:text-[#D63838]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newActionInput}
                  onChange={(e) => setNewActionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDefensiveAction();
                    }
                  }}
                  placeholder="Add a concrete defensive step (e.g. Audit edge VPN logs for CVE-2024-3400)..."
                  className="flex-1 rounded border border-[#2B2B2B] bg-[#191919] px-3 py-1.5 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddDefensiveAction}
                  className="flex items-center gap-1.5 rounded border border-[#2B2B2B] bg-[#202020] px-3 py-1.5 text-xs text-[#F5F5F5] hover:bg-[#2B2B2B]"
                >
                  <Plus size={14} />
                  <span>Add Action</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Metadata, Editorial Status, Featured Placement */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Publication Box */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <h3 className="font-serif text-sm font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
              Editorial Status & Verification
            </h3>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Publication Status
              </label>
              <select
                value={editorialStatus}
                onChange={(e) => setEditorialStatus(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Published">Published (Live)</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Verification Status
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="SIGNAL">SIGNAL — Verified</option>
                <option value="WATCH">WATCH — Developing</option>
                <option value="UNVERIFIED">UNVERIFIED — Unconfirmed</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Threat Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="Critical">Critical (Immediate Outage / Threat)</option>
                <option value="High">High (Severe Active Threat)</option>
                <option value="Medium">Medium (Advisory / Patch Available)</option>
                <option value="Low">Low (Informational)</option>
              </select>
            </div>

            {editorialStatus === "Scheduled" && (
              <div>
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Featured & Breaking Flags */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <h3 className="font-serif text-sm font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
              Homepage Placement & Wire
            </h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="h-4 w-4 rounded border-[#2B2B2B] bg-[#191919] text-[#D63838] focus:ring-0"
              />
              <span className="text-xs font-semibold text-[#F5F5F5] flex items-center gap-1.5">
                <Radio size={14} className="text-[#D63838]" />
                Mark as Breaking News
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-[#2B2B2B] bg-[#191919] text-[#D63838] focus:ring-0"
              />
              <span className="text-xs font-semibold text-[#F5F5F5] flex items-center gap-1.5">
                <Star size={14} className="text-[#F2B45B]" />
                Feature on Homepage
              </span>
            </label>

            {isFeatured && (
              <div className="space-y-3 border-t border-[#2B2B2B] pt-3">
                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                    Featured Position
                  </label>
                  <select
                    value={featuredPosition}
                    onChange={(e) => setFeaturedPosition(e.target.value)}
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  >
                    <option value="lead">Lead Story (Top Centerpiece)</option>
                    <option value="top">Top Story (Hero Column)</option>
                    <option value="secondary">Secondary Story</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                    Display Priority (Higher = First)
                  </label>
                  <input
                    type="number"
                    value={featuredPriority}
                    onChange={(e) => setFeaturedPriority(Number(e.target.value))}
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category & Region */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <h3 className="font-serif text-sm font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
              Category & Region
            </h3>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Target Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                {MENA_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Sub-Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="Gulf">Gulf (GCC)</option>
                <option value="Levant">Levant</option>
                <option value="North Africa">North Africa</option>
                <option value="MENA General">MENA General</option>
                <option value="Global">Global</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ransomware, MuddyWater, Saudi Arabia, CISA"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
              />
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-2">
              <h3 className="font-serif text-sm font-semibold text-[#F5F5F5]">Featured Image</h3>
              <button
                type="button"
                onClick={() => setMediaModalOpen(true)}
                className="flex items-center gap-1.5 font-mono text-xs text-[#D63838] hover:underline"
              >
                <ImageIcon size={13} />
                <span>Media Library</span>
              </button>
            </div>

            {featuredImage ? (
              <div className="space-y-2">
                <div className="aspect-video w-full overflow-hidden rounded border border-[#2B2B2B] bg-[#0B0B0B]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:border-[#D63838] focus:outline-none"
                />
              </div>
            ) : (
              <div
                onClick={() => setMediaModalOpen(true)}
                className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#2B2B2B] bg-[#191919] p-4 text-[#707070] hover:border-[#707070] hover:text-[#A1A1A1]"
              >
                <ImageIcon size={24} className="mb-1 opacity-60" />
                <span className="text-xs">Click to browse or upload image</span>
              </div>
            )}

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Image Caption & Credit
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Caption description..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="Photo source / credit..."
                className="mt-2 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Sources & Original Wire Links */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-3">
            <h3 className="font-serif text-sm font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2">
              Primary Sources
            </h3>
            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Source Organization
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                placeholder="e.g. Saudi NCA Advisory or CISA Wire"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Source URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Article SEO & Google Indexing */}
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
            <h3 className="font-serif text-sm font-semibold text-[#F5F5F5] border-b border-[#2B2B2B] pb-2 flex items-center justify-between">
              <span>Search Engine Optimization (SEO)</span>
              <span className="text-3xs font-mono text-[#D63838]">Google SERP</span>
            </h3>

            <div>
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  Primary Focus Keyword
                </label>
                <span className="text-3xs text-[#707070]">Core ranking target</span>
              </div>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. Saudi Arabia ransomware attack"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Secondary Keywords (comma separated)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="e.g. LockBit 3.0, NCA ECC compliance, ICS grid"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  Custom SEO Title
                </label>
                <span className={`text-3xs font-mono ${(seoTitle || headline).length > 65 ? "text-amber-400" : "text-[#707070]"}`}>
                  {(seoTitle || headline).length}/65 chars
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={headline || "Custom search title..."}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                  Meta Description
                </label>
                <span className={`text-3xs font-mono ${(seoDescription || shortDescription).length > 165 ? "text-amber-400" : "text-[#707070]"}`}>
                  {(seoDescription || shortDescription).length}/160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={shortDescription || "Search snippet description..."}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase text-[#A1A1A1]">
                Canonical URL Override (Optional)
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://mena-cyber-wire.vercel.app/article/..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noIndex}
                  onChange={(e) => setNoIndex(e.target.checked)}
                  className="rounded border-[#2B2B2B] bg-[#191919] text-[#D63838] focus:ring-0"
                />
                <span className="text-xs text-[#A1A1A1]">
                  Block search engines from indexing this article (<code className="text-3xs text-red-400">noindex</code>)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectImage={(url, cap, cred) => {
          setFeaturedImage(url);
          if (cap) setImageCaption(cap);
          if (cred) setImageCredit(cred);
        }}
      />
    </div>
  );
}

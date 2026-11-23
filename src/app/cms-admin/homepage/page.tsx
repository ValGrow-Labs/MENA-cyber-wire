"use client";

import { useEffect, useState } from "react";
import { LayoutTemplate, Save, Eye, EyeOff, MoveUp, MoveDown } from "lucide-react";
import { useAdmin } from "../layout";
import { CMSHomepageSection } from "@/types/cms";

export default function CMSHomepageBuilderPage() {
  const { notify } = useAdmin();
  const [sections, setSections] = useState<CMSHomepageSection[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.sections) {
          setSections(d.data.sections);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const copy = [...sections];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // re-index order
    copy.forEach((s, i) => (s.order = i + 1));
    setSections(copy);
  };

  const toggleSectionEnabled = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Homepage layout configuration saved!", "success");
      } else {
        notify(data.error || "Save failed", "error");
      }
    } catch {
      notify("Failed to save homepage layout", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707070]">Loading homepage builder...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Homepage Sections
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Reorder homepage blocks and toggle section visibility.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#b02c2c] disabled:opacity-50"
        >
          <Save size={15} />
          <span>{saving ? "Saving..." : "Save Layout"}</span>
        </button>
      </div>

      <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
        <p className="text-xs text-[#A1A1A1]">
          Use the arrows to reposition sections in the order they should render from top to bottom on the public front page.
        </p>

        <div className="space-y-2">
          {sections.map((sec, index) => (
            <div
              key={sec.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3.5 transition-colors ${
                sec.isEnabled ? "border-[#2B2B2B] bg-[#191919]" : "border-[#2B2B2B]/40 bg-[#151515] opacity-50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#202020] font-mono text-xs font-bold text-[#A1A1A1]">
                  {sec.order || index + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-[#F5F5F5] truncate">{sec.title}</h4>
                  <p className="font-mono text-[10px] text-[#707070]">Section key: {sec.type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleSectionEnabled(sec.id)}
                  className={`flex items-center gap-1.5 rounded border px-3 py-1 text-xs font-medium ${
                    sec.isEnabled
                      ? "border-[#27AE60]/30 bg-[#27AE60]/10 text-[#27AE60]"
                      : "border-[#707070]/30 bg-[#202020] text-[#707070]"
                  }`}
                >
                  {sec.isEnabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{sec.isEnabled ? "Visible" : "Hidden"}</span>
                </button>

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSection(index, "up")}
                  className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5] disabled:opacity-30"
                  title="Move Up"
                >
                  <MoveUp size={16} />
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(index, "down")}
                  className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5] disabled:opacity-30"
                  title="Move Down"
                >
                  <MoveDown size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

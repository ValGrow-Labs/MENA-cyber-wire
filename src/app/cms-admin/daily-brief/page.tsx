"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Save, Printer, Plus, Trash2, Check, Shield } from "lucide-react";
import { CMSDailyBrief } from "@/types/cms";
import { useAdmin } from "../layout";

export default function CMSDailyBriefPage() {
  const { notify } = useAdmin();
  const [brief, setBrief] = useState<CMSDailyBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [date, setDate] = useState("");
  const [threatLevel, setThreatLevel] = useState<any>("GUARDED");
  const [headline, setHeadline] = useState("");
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [targetedSectorsInput, setTargetedSectorsInput] = useState("");
  const [threatActorsInput, setThreatActorsInput] = useState("");
  const [keyTakeaway, setKeyTakeaway] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [newAction, setNewAction] = useState("");

  const fetchDailyBrief = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/daily-brief");
      const d = await res.json();
      if (d.success && d.current) {
        setBrief(d.current);
        setDate(d.current.date || new Date().toISOString().split("T")[0]);
        setThreatLevel(d.current.threatLevel || "GUARDED");
        setHeadline(d.current.headline || "");
        setExecutiveSummary(d.current.executiveSummary || "");
        setTargetedSectorsInput((d.current.targetedSectors || []).join(", "));
        setThreatActorsInput((d.current.primaryThreatActors || []).join(", "));
        setKeyTakeaway(d.current.keyTakeaway || "");
        setActions(d.current.recommendedDefensiveActions || []);
      }
    } catch {
      notify("Failed to fetch daily brief", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyBrief();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAction = () => {
    if (!newAction.trim()) return;
    setActions([...actions, newAction.trim()]);
    setNewAction("");
  };

  const handleRemoveAction = (idx: number) => {
    setActions(actions.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<CMSDailyBrief> = {
        date,
        threatLevel,
        headline,
        executiveSummary,
        targetedSectors: targetedSectorsInput.split(",").map((s) => s.trim()).filter(Boolean),
        primaryThreatActors: threatActorsInput.split(",").map((s) => s.trim()).filter(Boolean),
        keyTakeaway,
        recommendedDefensiveActions: actions,
        status: "Published",
      };

      const res = await fetch("/api/cms/daily-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (d.success) {
        notify("Executive Daily Brief published to public site!", "success");
      }
    } catch {
      notify("Failed to save daily brief", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707070]">Loading daily brief...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Daily Brief
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Edit the morning brief and recommended defensive actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/daily-brief"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded border border-[#2B2B2B] bg-[#191919] px-4 py-2 text-xs font-semibold text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
          >
            <Printer size={14} />
            <span>Preview Print View</span>
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded bg-[#D63838] px-5 py-2 text-xs font-semibold text-white shadow hover:bg-[#b02c2c] disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? "Publishing..." : "Publish Daily Brief"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Regional Posture (Threat Level)</label>
            <select
              value={threatLevel}
              onChange={(e) => setThreatLevel(e.target.value)}
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="ELEVATED">ELEVATED</option>
              <option value="GUARDED">GUARDED</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Daily Brief Headline</label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. What our desk follows across the region, and why."
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 font-serif text-sm font-semibold text-[#F5F5F5] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Executive Summary (07:00 AST Posture)</label>
          <textarea
            rows={3}
            value={executiveSummary}
            onChange={(e) => setExecutiveSummary(e.target.value)}
            placeholder="High-level synthesis of regional cyber operations, perimeter attacks, and strategic alerts..."
            className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-3 text-xs text-[#F5F5F5] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Targeted Sectors (Comma separated)</label>
            <input
              type="text"
              value={targetedSectorsInput}
              onChange={(e) => setTargetedSectorsInput(e.target.value)}
              placeholder="Energy, Government, Banking, Telecoms"
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Primary Threat Actors Under Watch</label>
            <input
              type="text"
              value={threatActorsInput}
              onChange={(e) => setThreatActorsInput(e.target.value)}
              placeholder="MuddyWater, OilRig, Shamoon, LockBit"
              className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Key Takeaway for CISOs</label>
          <textarea
            rows={2}
            value={keyTakeaway}
            onChange={(e) => setKeyTakeaway(e.target.value)}
            placeholder="Core defensive takeaway..."
            className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase text-[#A1A1A1] mb-2">
            Recommended Action Directives (Numbered list on print digest)
          </label>
          <div className="space-y-2">
            {actions.map((act, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs">
                <Check size={14} className="text-[#27AE60] shrink-0" />
                <span className="flex-1 text-[#F5F5F5]">{act}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAction(idx)}
                  className="text-[#707070] hover:text-[#D63838]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddAction();
                }
              }}
              placeholder="e.g. Check perimeter gateways against the current KEV list and patch anything listed..."
              className="flex-1 rounded border border-[#2B2B2B] bg-[#191919] px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddAction}
              className="flex items-center gap-1.5 rounded border border-[#2B2B2B] bg-[#202020] px-4 py-2 text-xs text-[#F5F5F5] hover:bg-[#2B2B2B]"
            >
              <Plus size={14} />
              <span>Add Directive</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

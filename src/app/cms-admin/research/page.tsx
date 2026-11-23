"use client";

import { useEffect, useState } from "react";
import { Binary, Plus, Edit2, Trash2, Shield } from "lucide-react";
import { CMSThreatActorResearch } from "@/types/cms";
import { useAdmin } from "../AdminContext";
import ConfirmModal from "@/components/cms/ConfirmModal";

export default function CMSResearchPage() {
  const { notify } = useAdmin();
  const [actors, setActors] = useState<CMSThreatActorResearch[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActor, setEditingActor] = useState<CMSThreatActorResearch | null>(null);

  // Fields
  const [name, setName] = useState("");
  const [aliases, setAliases] = useState("");
  const [origin, setOrigin] = useState("");
  const [region, setRegion] = useState("");
  const [targetSectors, setTargetSectors] = useState("");
  const [description, setDescription] = useState("");
  const [threatProfile, setThreatProfile] = useState("");
  const [tactics, setTactics] = useState("");
  const [techniques, setTechniques] = useState("");
  const [indicators, setIndicators] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CMSThreatActorResearch | null>(null);

  const fetchActors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/research");
      const d = await res.json();
      if (d.success) setActors(d.data);
    } catch {
      notify("Failed to fetch threat actors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingActor(null);
    setName("");
    setAliases("");
    setOrigin("");
    setRegion("Middle East");
    setTargetSectors("Government, Energy, Telecom");
    setDescription("");
    setThreatProfile("");
    setTactics("Spear-phishing, Living-off-the-Land");
    setTechniques("T1566, T1059");
    setIndicators("powershell.exe, C2 domain");
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (a: CMSThreatActorResearch) => {
    setEditingActor(a);
    setName(a.name);
    setAliases(a.aliases || "");
    setOrigin(a.origin || "");
    setRegion(a.region || "");
    setTargetSectors((a.targetSectors || []).join(", "));
    setDescription(a.description || "");
    setThreatProfile(a.threatProfile || "");
    setTactics((a.tactics || []).join(", "));
    setTechniques((a.techniques || []).join(", "));
    setIndicators((a.indicators || []).join(", "));
    setIsFeatured(Boolean(a.isFeatured));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const payload: Partial<CMSThreatActorResearch> = {
        name,
        aliases,
        origin,
        region,
        targetSectors: targetSectors.split(",").map((s) => s.trim()).filter(Boolean),
        description,
        threatProfile,
        tactics: tactics.split(",").map((s) => s.trim()).filter(Boolean),
        techniques: techniques.split(",").map((s) => s.trim()).filter(Boolean),
        indicators: indicators.split(",").map((s) => s.trim()).filter(Boolean),
        isFeatured,
        publicationStatus: "Published",
      };

      const url = editingActor ? `/api/cms/research/${editingActor.id}` : "/api/cms/research";
      const method = editingActor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (d.success) {
        notify(`Threat actor ${editingActor ? "updated" : "created"}!`, "success");
        setIsModalOpen(false);
        fetchActors();
      }
    } catch {
      notify("Failed to save threat actor", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/research/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Threat actor deleted", "success");
        setDeleteTarget(null);
        fetchActors();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Research & Threat Actors
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Manage research profiles for threat actors and groups operating in the region.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>Add Threat Actor</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {actors.map((actor) => (
          <div key={actor.id} className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#F5F5F5]">{actor.name}</h3>
                  {actor.isFeatured && (
                    <span className="rounded bg-[#F2B45B]/20 text-[#F2B45B] border border-[#F2B45B]/30 px-1.5 py-0.2 font-mono text-[9px] uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-[#D63838]">Aliases: {actor.aliases || "N/A"}</p>
                <p className="text-[11px] text-[#A1A1A1]">Origin: {actor.origin}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(actor)}
                  className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                  title="Edit Profile"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(actor)}
                  className="rounded p-1.5 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#A1A1A1] leading-relaxed line-clamp-3">{actor.description}</p>

            <div className="border-t border-[#2B2B2B] pt-2 text-[11px] text-[#707070] space-y-1">
              <div><strong className="text-[#A1A1A1]">Target Sectors:</strong> {(actor.targetSectors || []).join(", ")}</div>
              <div><strong className="text-[#A1A1A1]">TTPs:</strong> {(actor.techniques || []).join(", ")}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="w-full max-w-2xl rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">
              {editingActor ? `Edit Profile: ${editingActor.name}` : "New Threat Actor Profile"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Group Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MuddyWater"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Aliases</label>
                <input
                  type="text"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  placeholder="Mango Sandstorm, Static Kitten, MERCURY"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Attribution / Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Iranian state (MOIS)"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Operating Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Gulf, Levant, Global"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Targeted Sectors (Comma separated)</label>
              <input
                type="text"
                value={targetSectors}
                onChange={(e) => setTargetSectors(e.target.value)}
                placeholder="Government, Telecommunications, Energy, Petrochemicals"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of adversary group mandate and tracking history..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Threat Profile & Malware Families</label>
              <textarea
                rows={2}
                value={threatProfile}
                onChange={(e) => setThreatProfile(e.target.value)}
                placeholder="Custom backdoors (POWERSTATS, Small Sieve), remote tools used..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Tactics (TTPs)</label>
                <input
                  type="text"
                  value={tactics}
                  onChange={(e) => setTactics(e.target.value)}
                  placeholder="Initial Access, Execution, Persistence"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">MITRE ATT&CK IDs</label>
                <input
                  type="text"
                  value={techniques}
                  onChange={(e) => setTechniques(e.target.value)}
                  placeholder="T1566, T1059, T1219"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Known Indicators of Compromise (IoCs)</label>
              <input
                type="text"
                value={indicators}
                onChange={(e) => setIndicators(e.target.value)}
                placeholder="syncro.exe, malicious-c2-domain.com"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[#2B2B2B] bg-[#191919] text-[#D63838]"
              />
              <span className="text-xs text-[#F5F5F5]">Feature in public research highlights</span>
            </label>

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
                Save Threat Actor
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Threat Actor Profile?"
        message={`Delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

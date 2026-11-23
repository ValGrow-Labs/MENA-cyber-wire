"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { CMSVulnerabilityEditorial } from "@/types/cms";
import { useAdmin } from "../AdminContext";
import ConfirmModal from "@/components/cms/ConfirmModal";

export default function CMSVulnerabilitiesPage() {
  const { notify } = useAdmin();
  const [editorials, setEditorials] = useState<CMSVulnerabilityEditorial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CMSVulnerabilityEditorial | null>(null);

  // Form fields
  const [cveId, setCveId] = useState("");
  const [editorialTitle, setEditorialTitle] = useState("");
  const [editorialSeverity, setEditorialSeverity] = useState<any>("CRITICAL");
  const [cvssScore, setCvssScore] = useState<number | "">(10.0);
  const [vendor, setVendor] = useState("");
  const [affectedProductsInput, setAffectedProductsInput] = useState("");
  const [description, setDescription] = useState("");
  const [menaImpactNotes, setMenaImpactNotes] = useState("");
  const [recommendedRemediation, setRecommendedRemediation] = useState("");
  const [patchStatus, setPatchStatus] = useState<any>("Available");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CMSVulnerabilityEditorial | null>(null);

  const fetchVulnerabilities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/vulnerabilities");
      const d = await res.json();
      if (d.success) setEditorials(d.data);
    } catch {
      notify("Failed to fetch vulnerability annotations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulnerabilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setCveId("CVE-2024-");
    setEditorialTitle("");
    setEditorialSeverity("CRITICAL");
    setCvssScore(9.8);
    setVendor("");
    setAffectedProductsInput("");
    setDescription("");
    setMenaImpactNotes("");
    setRecommendedRemediation("");
    setPatchStatus("Available");
    setIsFeatured(false);
    setIsHidden(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CMSVulnerabilityEditorial) => {
    setEditingItem(item);
    setCveId(item.cveId);
    setEditorialTitle(item.editorialTitle || "");
    setEditorialSeverity(item.editorialSeverity || "HIGH");
    setCvssScore(item.cvssScore !== undefined ? item.cvssScore : "");
    setVendor(item.vendor || "");
    setAffectedProductsInput((item.affectedProducts || []).join(", "));
    setDescription(item.description || "");
    setMenaImpactNotes(item.menaImpactNotes || "");
    setRecommendedRemediation(item.recommendedRemediation || "");
    setPatchStatus(item.patchStatus || "Available");
    setIsFeatured(Boolean(item.isFeatured));
    setIsHidden(Boolean(item.isHidden));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cveId.trim()) return;

    try {
      const payload: Partial<CMSVulnerabilityEditorial> = {
        cveId: cveId.trim().toUpperCase(),
        editorialTitle,
        editorialSeverity,
        cvssScore: cvssScore !== "" ? Number(cvssScore) : undefined,
        vendor,
        affectedProducts: affectedProductsInput.split(",").map((s) => s.trim()).filter(Boolean),
        description,
        menaImpactNotes,
        recommendedRemediation,
        patchStatus,
        isFeatured,
        isHidden,
      };

      const res = await fetch("/api/cms/vulnerabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (d.success) {
        notify(`Annotation for ${payload.cveId} saved!`, "success");
        setIsModalOpen(false);
        fetchVulnerabilities();
      }
    } catch {
      notify("Failed to save vulnerability annotation", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/vulnerabilities/${deleteTarget.cveId}`, { method: "DELETE" });
      if (res.ok) {
        notify("Annotation deleted", "success");
        setDeleteTarget(null);
        fetchVulnerabilities();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Vulnerabilities & Advisories
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Add regional impact notes and remediation guidance to CVE entries alongside live NVD and CISA data.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>Add CVE Note</span>
        </button>
      </div>

      <div className="space-y-4">
        {editorials.map((vuln) => (
          <div
            key={vuln.cveId}
            className={`rounded-lg border p-5 space-y-3 transition-colors ${
              vuln.isHidden ? "border-[#2B2B2B] bg-[#151515]/60 opacity-60" : "border-[#2B2B2B] bg-[#151515]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#D63838]">{vuln.cveId}</span>
                  {vuln.cvssScore && (
                    <span className="rounded bg-[#D63838]/20 px-2 py-0.5 font-mono text-xs font-bold text-[#D63838] border border-[#D63838]/40">
                      CVSS {vuln.cvssScore.toFixed(1)}
                    </span>
                  )}
                  {vuln.isFeatured && (
                    <span className="rounded bg-[#F2B45B]/20 text-[#F2B45B] border border-[#F2B45B]/40 px-1.5 py-0.5 font-mono text-[9px] uppercase">
                      Featured In Widget
                    </span>
                  )}
                  {vuln.isHidden && (
                    <span className="rounded bg-[#707070]/20 text-[#A1A1A1] px-1.5 py-0.5 font-mono text-[9px] uppercase">
                      Hidden from public feed
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-serif text-sm font-semibold text-[#F5F5F5]">
                  {vuln.editorialTitle || vuln.description}
                </h3>
                {vuln.vendor && (
                  <p className="font-mono text-[11px] text-[#A1A1A1]">
                    Vendor: {vuln.vendor} &middot; Affected: {(vuln.affectedProducts || []).join(", ")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(vuln)}
                  className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                  title="Edit Annotation"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => setDeleteTarget(vuln)}
                  className="rounded p-1.5 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                  title="Delete Annotation"
                >
                  <Trash2 size={15} />
                </button>
                <a
                  href={`https://nvd.nist.gov/vuln/detail/${vuln.cveId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1.5 text-[#707070] hover:bg-[#202020] hover:text-[#F5F5F5]"
                  title="Open Official NIST NVD Record"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>

            {vuln.menaImpactNotes && (
              <div className="rounded border border-[#087E8B]/30 bg-[#087E8B]/10 p-3 text-xs text-[#E5F2F5]">
                <strong className="font-mono text-[10px] uppercase text-[#087E8B] block mb-1">
                  MENA REGIONAL IMPACT & REGULATORY NOTE
                </strong>
                {vuln.menaImpactNotes}
              </div>
            )}

            {vuln.recommendedRemediation && (
              <div className="rounded border border-[#27AE60]/30 bg-[#27AE60]/10 p-3 text-xs text-[#F5F5F5]">
                <strong className="font-mono text-[10px] uppercase text-[#27AE60] block mb-1">
                  TACTICAL MITIGATION DIRECTIVE
                </strong>
                {vuln.recommendedRemediation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSave} className="w-full max-w-2xl rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 shadow-2xl space-y-4 my-8">
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">
              {editingItem ? `Edit CVE Overlay: ${editingItem.cveId}` : "Annotate Vulnerability / Directive"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">CVE Identifier</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingItem)}
                  value={cveId}
                  onChange={(e) => setCveId(e.target.value)}
                  placeholder="CVE-2024-3400"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">CVSS Score (0.0 - 10.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={cvssScore}
                  onChange={(e) => setCvssScore(e.target.value ? Number(e.target.value) : "")}
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Editorial Title</label>
                <input
                  type="text"
                  value={editorialTitle}
                  onChange={(e) => setEditorialTitle(e.target.value)}
                  placeholder="e.g. Palo Alto PAN-OS Command Injection Zero-Day"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Vendor</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="Palo Alto Networks / Fortinet / Ivanti"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Patch Status</label>
                <select
                  value={patchStatus}
                  onChange={(e) => setPatchStatus(e.target.value)}
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                >
                  <option value="Available">Patch Available</option>
                  <option value="Workaround">Workaround Only</option>
                  <option value="Zero-Day">Zero-Day / Unpatched</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Affected Products (Comma separated)</label>
                <input
                  type="text"
                  value={affectedProductsInput}
                  onChange={(e) => setAffectedProductsInput(e.target.value)}
                  placeholder="PAN-OS 10.2, PAN-OS 11.0, PAN-OS 11.1"
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#087E8B]">
                MENA Impact & Regulatory Note (Directives / Blast Radius)
              </label>
              <textarea
                rows={3}
                value={menaImpactNotes}
                onChange={(e) => setMenaImpactNotes(e.target.value)}
                placeholder="Extensively deployed as boundary firewall in GCC government, banking, and energy perimeter networks..."
                className="mt-1 w-full rounded border border-[#087E8B]/40 bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#27AE60]">
                Recommended Mitigation / Remediation Directive
              </label>
              <textarea
                rows={3}
                value={recommendedRemediation}
                onChange={(e) => setRecommendedRemediation(e.target.value)}
                placeholder="Specific upgrade versions, hotfixes, or network segmentation directives..."
                className="mt-1 w-full rounded border border-[#27AE60]/40 bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#2B2B2B] bg-[#191919] text-[#D63838]"
                />
                <span className="text-xs text-[#F5F5F5]">Feature in top vulnerability widget</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHidden}
                  onChange={(e) => setIsHidden(e.target.checked)}
                  className="rounded border-[#2B2B2B] bg-[#191919] text-[#D63838]"
                />
                <span className="text-xs text-[#F5F5F5]">Hide from public advisory list</span>
              </label>
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
                Save Annotation
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Annotation?"
        message={`Delete editorial annotation for "${deleteTarget?.cveId}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

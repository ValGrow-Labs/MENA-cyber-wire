"use client";

import { useEffect, useState } from "react";
import { Globe2, Save, CheckCircle2, Shield, AlertTriangle } from "lucide-react";
import { CMSCountryProfile } from "@/types/cms";
import { useAdmin } from "../layout";

export default function CMSCountriesPage() {
  const { notify } = useAdmin();
  const [countries, setCountries] = useState<CMSCountryProfile[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>("SA");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for selected country
  const [threatLevel, setThreatLevel] = useState<any>("Elevated");
  const [certAgency, setCertAgency] = useState("");
  const [cybersecurityAgency, setCybersecurityAgency] = useState("");
  const [criticalSectorsInput, setCriticalSectorsInput] = useState("");
  const [regulatoryFramework, setRegulatoryFramework] = useState("");
  const [cyberLawsInput, setCyberLawsInput] = useState("");
  const [summary, setSummary] = useState("");

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/countries");
      const d = await res.json();
      if (d.success && Array.isArray(d.data)) {
        setCountries(d.data);
        const current = d.data.find((c: CMSCountryProfile) => c.code === selectedCode) || d.data[0];
        if (current) {
          loadCountryIntoForm(current);
        }
      }
    } catch {
      notify("Failed to fetch country profiles", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadCountryIntoForm = (c: CMSCountryProfile) => {
    setSelectedCode(c.code);
    setThreatLevel(c.threatLevel || "Elevated");
    setCertAgency(c.certAgency || "");
    setCybersecurityAgency(c.cybersecurityAgency || c.certAgency || "");
    setCriticalSectorsInput((c.criticalInfrastructureSectors || []).join(", "));
    setRegulatoryFramework(c.regulatoryFramework || c.summary || "");
    setCyberLawsInput((c.cybersecurityLaws || []).join("\n"));
    setSummary(c.summary || "");
  };

  useEffect(() => {
    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCountry = (code: string) => {
    const c = countries.find((item) => item.code === code);
    if (c) {
      loadCountryIntoForm(c);
    }
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Partial<CMSCountryProfile> = {
        threatLevel,
        certAgency,
        cybersecurityAgency,
        criticalInfrastructureSectors: criticalSectorsInput.split(",").map((s) => s.trim()).filter(Boolean),
        regulatoryFramework,
        cybersecurityLaws: cyberLawsInput.split("\n").map((s) => s.trim()).filter(Boolean),
        summary,
        editorialSummary: summary,
      };

      const res = await fetch(`/api/cms/countries/${selectedCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const d = await res.json();
      if (d.success) {
        notify(`Country profile for ${d.data.name} updated!`, "success");
        // Update local list
        setCountries(countries.map((c) => (c.code === selectedCode ? { ...c, ...d.data } : c)));
      } else {
        notify(d.error || "Update failed", "error");
      }
    } catch {
      notify("Failed to save country profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-[#707070]">Loading country profiles...</div>;
  }

  const currentCountry = countries.find((c) => c.code === selectedCode);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Country Desks
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Manage national CERT information, regulatory frameworks, threat levels, and infrastructure sectors for the 13 MENA countries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Country Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-3">
            <p className="px-2 py-1 font-mono text-[10px] uppercase text-[#707070]">Select National Desk</p>
            <div className="mt-2 space-y-1 max-h-[70vh] overflow-y-auto">
              {countries.map((c) => {
                const isSel = c.code === selectedCode;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelectCountry(c.code)}
                    className={`flex w-full items-center justify-between rounded-md p-2.5 text-xs text-left transition-colors ${
                      isSel
                        ? "bg-[#D63838] text-white font-semibold"
                        : "text-[#A1A1A1] hover:bg-[#191919] hover:text-[#F5F5F5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span>{c.name}</span>
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded ${
                        isSel ? "bg-black/30 text-white" : "bg-[#202020] text-[#707070]"
                      }`}
                    >
                      {c.threatLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Country Profile Form */}
        <div className="lg:col-span-8">
          {currentCountry && (
            <form onSubmit={handleSaveCountry} className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentCountry.flag}</span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#F5F5F5]">{currentCountry.name}</h3>
                    <p className="font-mono text-[11px] text-[#A1A1A1]">{currentCountry.nativeName} &middot; Region: {currentCountry.region}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#b02c2c] disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? "Saving..." : "Save Country Profile"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                    National Threat Level
                  </label>
                  <select
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(e.target.value)}
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Elevated">Elevated</option>
                    <option value="Guarded">Guarded</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                    National CERT
                  </label>
                  <input
                    type="text"
                    value={certAgency}
                    onChange={(e) => setCertAgency(e.target.value)}
                    placeholder="e.g. aeCERT / TDRA"
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                    National Cybersecurity Authority / Policy Agency
                  </label>
                  <input
                    type="text"
                    value={cybersecurityAgency}
                    onChange={(e) => setCybersecurityAgency(e.target.value)}
                    placeholder="e.g. National Cybersecurity Authority (NCA) / UAE Cybersecurity Council"
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                    Critical Infrastructure Sectors (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={criticalSectorsInput}
                    onChange={(e) => setCriticalSectorsInput(e.target.value)}
                    placeholder="Oil & Petrochemicals, Banking, Desalination, Government"
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                    Cybersecurity Laws & Statutory Controls (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={cyberLawsInput}
                    onChange={(e) => setCyberLawsInput(e.target.value)}
                    placeholder="Personal Data Protection Law (PDPL)&#10;Essential Cybersecurity Controls (ECC-1:2018)"
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">
                    Country Intelligence Summary
                  </label>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Summary of national cybersecurity posture, regulatory mandate, and threat landscape..."
                    className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:outline-none"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

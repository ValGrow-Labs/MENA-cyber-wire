import { Terminal, Shield, ExternalLink, ArrowRight } from "lucide-react";

export default function ResearchPage() {
  const threatActors = [
    {
      name: "MuddyWater (Mango Sandstorm / Seedworm)",
      origin: "State-Aligned",
      targets: "Government ministries, telecommunications, and financial institutions in Saudi Arabia, UAE, and Qatar.",
      techniques: "Spear-phishing with weaponized macro docs, PowerShell backdoors (POWERSTATS), living-off-the-land binaries.",
      activeCampaign: "Campaign spoofing GCC central banks compliance memos (March-May 2024).",
    },
    {
      name: "OilRig (Cobalt Gypsy / APT34)",
      origin: "State-Sponsored",
      targets: "Petrochemicals, aviation, and energy logistics across the Gulf Cooperation Council.",
      techniques: "DNS tunneling, LinkedIn social engineering, custom Web shells (RGDoor), side-loading DLLs.",
      activeCampaign: "Targeting maritime supply chain contractors in the Persian Gulf.",
    },
    {
      name: "LockBit 3.0 GCC Affiliates",
      origin: "Organized Cybercrime Syndicate",
      targets: "Regional retail chains, private healthcare groups, and construction conglomerates.",
      techniques: "Double-extortion via leaked credentials, PsExec lateral propagation, StealBit exfiltration tool.",
      activeCampaign: "Exploiting unpatched edge firewalls lacking MFA for initial ingress.",
    },
    {
      name: "DarkBit",
      origin: "Hacktivist / Ransomware",
      targets: "Technology service providers, educational institutions, and municipalities in the Levant.",
      techniques: "Rust-compiled multi-platform encryptors targeting Windows Active Directory and VMware ESXi.",
      activeCampaign: "Focus on virtual machine hypervisor encryption.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-border shadow-coastal-card">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-teal" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal">
            Threat Intelligence & Research
          </span>
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold font-serif text-ocean">
          Regional Adversary Profiles & DFIR Research
        </h1>
        <p className="text-xs text-slate-muted max-w-2xl mt-1 leading-relaxed">
          Comprehensive behavioral profiles, MITRE ATT&CK tactics, and indicators of compromise (IOCs) tracking threat groups targeting the MENA perimeter.
        </p>
      </div>

      {/* Adversary Profiles Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ocean flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal" />
          Monitored Threat Actors Active in MENA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threatActors.map((actor) => (
            <div
              key={actor.name}
              className="p-5 rounded-2xl bg-white border border-slate-border hover:border-teal/40 hover:shadow-coastal transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-border">
                <div>
                  <h3 className="text-base font-bold text-ocean">
                    {actor.name}
                  </h3>
                  <span className="text-[11px] font-mono text-teal font-semibold">
                    Classification: {actor.origin}
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-dark">
                <div>
                  <strong className="text-ocean">Target Profile: </strong>
                  {actor.targets}
                </div>
                <div>
                  <strong className="text-ocean">Primary TTPs: </strong>
                  {actor.techniques}
                </div>
                <div className="p-2.5 rounded-xl bg-mist border border-mist-border text-[11px]">
                  <strong className="text-alert-orange">Current Active Watch: </strong>
                  {actor.activeCampaign}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Papers Spotlight */}
      <div className="p-6 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ocean">
          Editorial Research Publications
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-ice border border-slate-border space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-teal font-bold">
              Whitepaper &middot; OT/ICS Defense
            </span>
            <h4 className="text-sm font-bold text-ocean">
              Securing Gulf Maritime Loading Telemetry: Air-Gapping SCADA Systems Under Modern Attack Vectors
            </h4>
            <p className="text-xs text-slate-dark leading-relaxed">
              A technical blueprint for petroleum and LNG terminal operators implementing data diodes and hardware-enforced unidirectional gateways.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-ice border border-slate-border space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-teal font-bold">
              Special Report &middot; Cloud Sovereignty
            </span>
            <h4 className="text-sm font-bold text-ocean">
              Implementing NCA ECC-1:2018 in Sovereign Hyperscaler Regions (Riyadh & Abu Dhabi)
            </h4>
            <p className="text-xs text-slate-dark leading-relaxed">
              Practical controls mapping for zero-trust architectures, HSM key custody, and telemetry retention within national borders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { History, Search, Shield, Filter } from "lucide-react";
import { CMSAuditLog } from "@/types/cms";
import { useAdmin } from "../layout";

export default function CMSAuditLogsPage() {
  const { notify } = useAdmin();
  const [logs, setLogs] = useState<CMSAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (targetTypeFilter !== "all") params.append("targetType", targetTypeFilter);

      const res = await fetch(`/api/cms/audit-logs?${params.toString()}`);
      const d = await res.json();
      if (d.success) setLogs(d.data);
    } catch {
      notify("Failed to load audit logs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTypeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Audit Logs
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Record of admin logins, article publications, and system events.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-4 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-[240px]">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#707070]">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by user, action, or details..."
              className="w-full rounded border border-[#2B2B2B] bg-[#191919] py-2 pl-9 pr-3 text-xs text-[#F5F5F5] focus:outline-none"
            />
          </div>
        </form>

        <select
          value={targetTypeFilter}
          onChange={(e) => setTargetTypeFilter(e.target.value)}
          className="rounded border border-[#2B2B2B] bg-[#191919] px-3 py-2 text-xs text-[#F5F5F5] focus:outline-none"
        >
          <option value="all">All Event Types</option>
          <option value="AUTH">Authentication Events</option>
          <option value="ARTICLE">Article Events</option>
          <option value="BREAKING">Breaking Wire Events</option>
          <option value="COUNTRY">Country Profile Events</option>
          <option value="RESEARCH">Research Events</option>
          <option value="VULNERABILITY">Vulnerability Events</option>
          <option value="SETTINGS">Settings Events</option>
          <option value="USER">User Account Events</option>
        </select>

        <span className="font-mono text-xs text-[#707070]">{logs.length} audit records</span>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-lg border border-[#2B2B2B] bg-[#151515]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#2B2B2B] bg-[#191919] font-mono text-[11px] uppercase tracking-wider text-[#707070]">
            <tr>
              <th className="py-3 px-4">Timestamp (AST)</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Admin User</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B2B2B] text-[#F5F5F5]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#707070]">
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#707070]">
                  No audit entries found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#191919]/60">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#A1A1A1] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString("en-GB", {
                      timeZone: "Asia/Riyadh",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-[#D63838]">{log.action}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                    <span className="text-[#F5F5F5]">{log.adminName}</span>
                    <span className="block text-[#707070]">{log.adminEmail}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="rounded bg-[#202020] px-1.5 py-0.5 font-mono text-[10px] text-[#A1A1A1]">
                      {log.targetType}
                    </span>
                    {log.targetTitle && (
                      <span className="block font-serif text-xs text-[#F5F5F5] truncate max-w-[200px] mt-0.5">
                        {log.targetTitle}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#A1A1A1] max-w-md truncate">{log.details || "—"}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#707070] whitespace-nowrap">
                    {log.ipAddress || "Internal"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Shield, CheckCircle2, XCircle, Trash2, Key } from "lucide-react";
import { AdminUser, AdminRole } from "@/types/cms";
import { useAdmin } from "../layout";
import ConfirmModal from "@/components/cms/ConfirmModal";

export default function CMSUsersPage() {
  const { user: currentAdmin, notify } = useAdmin();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // New user modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("EDITOR");

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/users");
      const d = await res.json();
      if (d.success) setUsers(d.data);
    } catch {
      notify("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    try {
      const res = await fetch("/api/cms/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const d = await res.json();
      if (d.success) {
        notify(`User ${email} created successfully!`, "success");
        setIsModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        fetchUsers();
      } else {
        notify(d.error || "Create failed", "error");
      }
    } catch {
      notify("Failed to create user", "error");
    }
  };

  const handleToggleActive = async (u: AdminUser) => {
    try {
      const res = await fetch(`/api/cms/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      if (res.ok) {
        notify(`User ${!u.isActive ? "activated" : "deactivated"}`, "info");
        fetchUsers();
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/users/${deleteTarget.id}`, { method: "DELETE" });
      const d = await res.json();
      if (res.ok && d.success) {
        notify("User deleted", "success");
        setDeleteTarget(null);
        fetchUsers();
      } else {
        notify(d.error || "Delete failed", "error");
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Users
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Manage editorial access: Super Admin, Editor, Author, and Moderator roles.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>New User</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2B2B2B] bg-[#151515]">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="border-b border-[#2B2B2B] bg-[#191919] font-mono text-[11px] uppercase tracking-wider text-[#707070]">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B2B2B] text-[#F5F5F5]">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#191919]/60">
                <td className="py-3 px-4 font-serif text-sm font-semibold">{u.name}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#A1A1A1]">{u.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                      u.role === "SUPER_ADMIN"
                        ? "bg-[#D63838]/20 text-[#D63838] border border-[#D63838]/30"
                        : u.role === "EDITOR"
                        ? "bg-[#087E8B]/20 text-[#087E8B] border border-[#087E8B]/30"
                        : u.role === "AUTHOR"
                        ? "bg-[#F2B45B]/20 text-[#F2B45B] border border-[#F2B45B]/30"
                        : "bg-[#2D9CDB]/20 text-[#2D9CDB] border border-[#2D9CDB]/30"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#707070]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#707070]">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                      u.isActive !== false ? "bg-[#27AE60]/15 text-[#27AE60]" : "bg-[#D63838]/15 text-[#D63838]"
                    }`}
                  >
                    {u.isActive !== false ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className="rounded p-1 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                      title={u.isActive ? "Suspend User" : "Activate User"}
                    >
                      {u.isActive ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                    </button>

                    {u.id !== currentAdmin?.id && (
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleCreateUser} className="w-full max-w-md rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">Create Admin User Account</h3>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Senior Regional Threat Analyst"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@menacyberwire.com"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Initial Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Role-Based Access Level</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN — Full system access & user management</option>
                <option value="EDITOR">EDITOR — Publish and curate all editorial content</option>
                <option value="AUTHOR">AUTHOR — Create and edit own articles</option>
                <option value="MODERATOR">MODERATOR — Moderate practitioner community discussions</option>
              </select>
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
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Admin Account?"
        message={`Delete admin account "${deleteTarget?.email}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

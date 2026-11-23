"use client";

import { useEffect, useState } from "react";
import { FolderTree, Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { CMSCategory } from "@/types/cms";
import { useAdmin } from "../layout";
import ConfirmModal from "@/components/cms/ConfirmModal";

export default function CMSCategoriesPage() {
  const { notify } = useAdmin();
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCat, setEditingCat] = useState<CMSCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [colorHex, setColorHex] = useState("#087E8B");
  const [order, setOrder] = useState(1);
  const [isEnabled, setIsEnabled] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<CMSCategory | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/categories");
      const d = await res.json();
      if (d.success) setCategories(d.data);
    } catch {
      notify("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingCat(null);
    setName("");
    setSlug("");
    setDescription("");
    setColorHex("#087E8B");
    setOrder(categories.length + 1);
    setIsEnabled(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CMSCategory) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setColorHex(cat.colorHex || "#087E8B");
    setOrder(cat.order || 1);
    setIsEnabled(cat.isEnabled !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const url = editingCat ? `/api/cms/categories/${editingCat.id}` : "/api/cms/categories";
      const method = editingCat ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCat?.id,
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description,
          colorHex,
          order: Number(order),
          isEnabled,
        }),
      });

      const data = await res.json();
      if (data.success) {
        notify(`Category ${editingCat ? "updated" : "created"}!`, "success");
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch {
      notify("Failed to save category", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/categories/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Category removed", "success");
        setDeleteTarget(null);
        fetchCategories();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Categories
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Manage categories and navigation topics for articles and news feeds.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>New Category</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2B2B2B] bg-[#151515]">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="border-b border-[#2B2B2B] bg-[#191919] font-mono text-[11px] uppercase tracking-wider text-[#707070]">
            <tr>
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Color Tag</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2B2B2B] text-[#F5F5F5]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#191919]/60">
                <td className="py-3 px-4 font-mono text-[#A1A1A1]">{c.order}</td>
                <td className="py-3 px-4 font-serif text-sm font-semibold">{c.name}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#707070]">{c.slug}</td>
                <td className="py-3 px-4 text-[#A1A1A1] max-w-xs truncate">{c.description}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="h-3 w-3 rounded-full border border-black/40" style={{ backgroundColor: c.colorHex || "#087E8B" }} />
                    {c.colorHex}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                      c.isEnabled !== false ? "bg-[#27AE60]/15 text-[#27AE60]" : "bg-[#707070]/20 text-[#707070]"
                    }`}
                  >
                    {c.isEnabled !== false ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="rounded p-1 text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                      title="Edit Category"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
                      className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleSave} className="w-full max-w-md rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">
              {editingCat ? "Edit Category" : "Create Threat Category"}
            </h3>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCat) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                }}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 font-mono text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Accent Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-[#2B2B2B] bg-transparent"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="flex-1 rounded border border-[#2B2B2B] bg-[#191919] p-1.5 font-mono text-xs text-[#F5F5F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#A1A1A1]">Sort Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="rounded border-[#2B2B2B] bg-[#191919] text-[#D63838]"
              />
              <span className="text-xs text-[#F5F5F5]">Enable category on public website</span>
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
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Category?"
        message={`Delete category "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

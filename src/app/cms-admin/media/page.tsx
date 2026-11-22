"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Search } from "lucide-react";
import { CMSMediaItem } from "@/types/cms";
import { useAdmin } from "../layout";
import ConfirmModal from "@/components/cms/ConfirmModal";

export default function CMSMediaLibraryPage() {
  const { notify } = useAdmin();
  const [items, setItems] = useState<CMSMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<CMSMediaItem | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/media");
      const d = await res.json();
      if (d.success) setItems(d.data);
    } catch {
      notify("Failed to load media assets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", file.name);

    try {
      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        notify("Media uploaded successfully!", "success");
        fetchMedia();
      } else {
        notify(data.error || "Upload failed", "error");
      }
    } catch {
      notify("Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (item: CMSMediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    notify("Image URL copied to clipboard", "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/media/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Media deleted", "success");
        setDeleteTarget(null);
        fetchMedia();
      }
    } catch {}
  };

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.originalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Media Library
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Upload and manage images and media files (JPG, PNG, WebP, SVG).
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]">
          <Upload size={15} />
          <span>{uploading ? "Uploading..." : "Upload New File"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#707070]">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="w-full rounded-md border border-[#2B2B2B] bg-[#151515] py-2 pl-9 pr-3 text-xs text-[#F5F5F5] placeholder-[#707070] focus:border-[#D63838] focus:outline-none"
          />
        </div>
        <span className="font-mono text-xs text-[#707070]">{filtered.length} files</span>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="p-12 text-center text-xs text-[#707070]">Loading media gallery...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-16 text-center text-xs text-[#707070]">
          <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p>No media files found. Upload your first asset using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-lg border border-[#2B2B2B] bg-[#151515] transition-all hover:border-[#707070]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#0B0B0B]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.altText || item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <p className="truncate font-serif text-xs font-semibold text-[#F5F5F5]">{item.title}</p>
                <p className="font-mono text-[10px] text-[#707070] mt-0.5">
                  {Math.round(item.sizeBytes / 1024)} KB &middot; {item.mimeType.split("/")[1]?.toUpperCase()}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-[#2B2B2B] pt-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="flex items-center gap-1 font-mono text-[11px] text-[#A1A1A1] hover:text-[#F5F5F5]"
                  >
                    {copiedId === item.id ? <Check size={12} className="text-[#27AE60]" /> : <Copy size={12} />}
                    <span>{copiedId === item.id ? "Copied" : "Copy URL"}</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="text-[#707070] hover:text-[#D63838]"
                    title="Delete media"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Media Asset?"
        message={`Delete "${deleteTarget?.originalName}" from permanent storage?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

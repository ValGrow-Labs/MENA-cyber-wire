"use client";

import { useEffect, useState } from "react";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { CMSMediaItem } from "@/types/cms";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, caption?: string, credit?: string) => void;
}

export default function MediaPickerModal({ isOpen, onClose, onSelectImage }: MediaPickerModalProps) {
  const [items, setItems] = useState<CMSMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/cms/media")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.data)) setItems(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (data.success && data.data) {
        setItems([data.data, ...items]);
        setSelectedId(data.data.id);
      }
    } catch {
    } finally {
      setUploading(false);
    }
  };

  const selectedItem = items.find((i) => i.id === selectedId);

  const confirmSelection = () => {
    if (selectedItem) {
      onSelectImage(selectedItem.url, selectedItem.caption, selectedItem.credit);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex h-[80vh] w-full max-w-4xl flex-col rounded-lg border border-[#2B2B2B] bg-[#151515] shadow-2xl text-[#F5F5F5]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B2B2B] px-5 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-[#D63838]" />
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">Select Media Asset</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#F5F5F5]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col md:grid md:grid-cols-12 overflow-hidden">
          {/* Gallery */}
          <div className="flex-1 overflow-y-auto border-b md:border-b-0 md:border-r border-[#2B2B2B] p-4 md:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs text-[#707070]">{items.length} media items</span>
              <label className="flex cursor-pointer items-center gap-2 rounded bg-[#D63838] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#b02c2c]">
                <Upload size={14} />
                <span>{uploading ? "Uploading..." : "Upload New File"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {loading ? (
              <p className="p-8 text-center text-xs text-[#707070]">Loading media gallery...</p>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[#707070]">
                <ImageIcon size={32} className="mb-2 opacity-50" />
                <p className="text-xs">No media uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {items.map((m) => {
                  const isSel = m.id === selectedId;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      className={`group relative aspect-video cursor-pointer overflow-hidden rounded border bg-[#191919] transition-all ${
                        isSel ? "border-[#D63838] ring-2 ring-[#D63838]/50" : "border-[#2B2B2B] hover:border-[#707070]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url}
                        alt={m.altText || m.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      {isSel && (
                        <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D63838] text-white">
                          <Check size={12} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 truncate bg-black/80 px-2 py-1 text-[10px] text-[#F5F5F5]">
                        {m.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="flex flex-col justify-between overflow-y-auto bg-[#191919] p-4 md:col-span-4 shrink-0 max-h-[40vh] md:max-h-none">
            {selectedItem ? (
              <div className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded border border-[#2B2B2B] bg-[#0B0B0B]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.altText}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#F5F5F5]">{selectedItem.title}</h4>
                  <p className="mt-1 font-mono text-[11px] text-[#707070] break-all">{selectedItem.url}</p>
                </div>
                <div className="space-y-2 text-xs text-[#A1A1A1]">
                  <div><strong className="text-[#F5F5F5]">MIME:</strong> {selectedItem.mimeType}</div>
                  <div><strong className="text-[#F5F5F5]">Size:</strong> {Math.round(selectedItem.sizeBytes / 1024)} KB</div>
                  <div><strong className="text-[#F5F5F5]">Uploaded by:</strong> {selectedItem.uploadedBy}</div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-xs text-[#707070]">
                Select an image from the gallery to view details.
              </div>
            )}

            <div className="mt-4 border-t border-[#2B2B2B] pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-[#2B2B2B] px-3 py-1.5 text-xs text-[#A1A1A1] hover:bg-[#202020]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedItem}
                onClick={confirmSelection}
                className="rounded bg-[#D63838] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50 hover:bg-[#b02c2c]"
              >
                Use Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

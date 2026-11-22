"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-[#2B2B2B] bg-[#151515] p-6 shadow-2xl text-[#F5F5F5]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isDestructive ? "bg-[#D63838]/20 text-[#D63838]" : "bg-[#F2B45B]/20 text-[#F2B45B]"
              }`}
            >
              <AlertTriangle size={20} />
            </span>
            <h3 className="font-serif text-lg font-semibold text-[#F5F5F5]">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="rounded p-1 text-[#707070] hover:bg-[#202020] hover:text-[#F5F5F5]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#A1A1A1]">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded border border-[#2B2B2B] bg-[#191919] px-4 py-2 text-xs font-medium text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`rounded px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors ${
              isDestructive
                ? "bg-[#D63838] hover:bg-[#b02c2c]"
                : "bg-[#087E8B] hover:bg-[#066570]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

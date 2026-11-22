"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  text: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg border p-3.5 shadow-2xl backdrop-blur transition-all ${
            toast.type === "success"
              ? "border-[#27AE60]/40 bg-[#151515] text-[#F5F5F5]"
              : toast.type === "error"
              ? "border-[#D63838]/40 bg-[#151515] text-[#F5F5F5]"
              : "border-[#2B2B2B] bg-[#151515] text-[#F5F5F5]"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 size={18} className="text-[#27AE60] shrink-0 mt-0.5" />}
          {toast.type === "error" && <AlertCircle size={18} className="text-[#D63838] shrink-0 mt-0.5" />}
          {toast.type === "info" && <Info size={18} className="text-[#2D9CDB] shrink-0 mt-0.5" />}
          {toast.type === "warning" && <AlertCircle size={18} className="text-[#F2B45B] shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs leading-snug">{toast.text}</div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#707070] hover:text-[#F5F5F5] shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}

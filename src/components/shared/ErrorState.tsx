import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Failed to load real-time intelligence feed.",
  onRetry,
}: Props) {
  return (
    <div className="p-8 text-center rounded-2xl bg-white border border-slate-border shadow-coastal-card my-6">
      <div className="inline-flex p-3 rounded-full bg-alert-light text-alert-orange mb-3 border border-alert-border">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-ocean mb-1">
        Intelligence Feed Interrupted
      </h3>
      <p className="text-xs text-slate-muted max-w-md mx-auto mb-4">
        {message} Public RSS and NVD endpoints may be temporarily rate-limited.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-teal text-white hover:bg-teal-dark transition-all shadow-coastal"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Live Fetch</span>
        </button>
      )}
    </div>
  );
}

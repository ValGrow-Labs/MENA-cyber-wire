export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-64 bg-mist rounded-2xl border border-mist-border" />
      <div className="h-12 bg-mist rounded-xl border border-mist-border" />
      <div className="space-y-3">
        <div className="h-36 bg-white rounded-2xl border border-slate-border" />
        <div className="h-36 bg-white rounded-2xl border border-slate-border" />
        <div className="h-36 bg-white rounded-2xl border border-slate-border" />
      </div>
    </div>
  );
}

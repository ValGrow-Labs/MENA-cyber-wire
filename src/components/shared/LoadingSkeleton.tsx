/** Skeleton shaped like the story river: timestamp column + headline + dek. */
export default function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading stories">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-[4.5rem_1fr] gap-5 border-t border-rule py-6 sm:grid-cols-[5.5rem_1fr_9rem]">
          <div className="space-y-2">
            <div className="h-3 w-12 rounded-full bg-paper-sunk" />
            <div className="h-3 w-9 bg-paper-sunk" />
          </div>
          <div className="space-y-3">
            <div className="h-3 w-28 bg-paper-sunk" />
            <div className="h-5 w-11/12 bg-paper-sunk" />
            <div className="h-5 w-3/5 bg-paper-sunk" />
            <div className="h-3 w-4/5 bg-paper-sunk" />
          </div>
          <div className="hidden aspect-[4/3] rounded-2xl bg-paper-sunk sm:block" />
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

"use client";

export function MovieGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-3"
        >
          <div className="h-56 rounded-xl bg-white/10" />
          <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
          <div className="mt-2 h-4 w-1/2 rounded bg-white/10" />
          <div className="mt-4 flex gap-2">
            <div className="h-9 w-20 rounded-lg bg-white/10" />
            <div className="h-9 w-20 rounded-lg bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
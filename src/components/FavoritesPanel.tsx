"use client";

import type { Favorite } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";
import { StarRating } from "./StarRating";

export function FavoritesPanel({
  favorites,
  onRemove,
  onUpdate,
  syncStatus,
  syncError,
}: {
  favorites: Favorite[];
  onRemove: (id: number) => void;
  onUpdate: (id: number, patch: { rating?: number; note?: string }) => void;
  syncStatus: "idle" | "syncing" | "online" | "offline";
  syncError: string | null;
}) {
  const syncLabel =
    syncStatus === "online"
      ? "Server sync on"
      : syncStatus === "syncing"
        ? "Syncing..."
        : "Local only";

  return (
    <div className="glass-shell p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-soft">Favorites</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted">{favorites.length}</span>
          <span
            className={[
              "rounded-full px-2 py-0.5",
              syncStatus === "online"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : syncStatus === "syncing"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "bg-zinc-500/20 text-zinc-700 dark:text-zinc-300",
            ].join(" ")}
          >
            {syncLabel}
          </span>
        </div>
      </div>

      {syncError && (
        <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
          {syncError}
        </div>
      )}

      {favorites.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-4 text-sm text-muted"
          style={{ borderColor: "rgba(var(--border), var(--border-a))" }}
        >
          Save a movie to track your rating and notes.
        </div>
      ) : (
        <div className="flex max-h-[72vh] flex-col gap-3 overflow-auto pr-1">
          {favorites.map((f) => {
            const img = posterUrl(f.poster_path);
            return (
              <div key={f.id} className="mini-shell grid grid-cols-[56px_1fr] gap-3 p-3">
                <div
                  className="overflow-hidden rounded-xl"
                  style={{ border: "1px solid rgba(var(--border), var(--border-a))" }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={`${f.title} poster`}
                      className="h-20 w-14 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-14 items-center justify-center text-[10px] text-muted">
                      No Poster
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-soft">
                        {f.title}
                      </div>
                      <div className="text-xs text-muted">
                        {(f.release_date || "").slice(0, 4) || "N/A"}
                      </div>
                    </div>

                    <button className="btn btn-danger px-3 py-1.5 text-xs" onClick={() => onRemove(f.id)}>
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <StarRating
                      value={f.rating}
                      onChange={(n) => onUpdate(f.id, { rating: n })}
                    />
                    <div className="text-xs text-muted">
                      {new Date(f.savedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <input
                    className="control mt-2 w-full px-3 py-2 text-sm"
                    value={f.note || ""}
                    placeholder="Add a quick note…"
                    onChange={(e) => onUpdate(f.id, { note: e.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

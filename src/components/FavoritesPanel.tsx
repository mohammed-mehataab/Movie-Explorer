"use client";

import type { Favorite } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";
import { StarRating } from "./StarRating";

export function FavoritesPanel({
  favorites,
  onRemove,
  onUpdate,
}: {
  favorites: Favorite[];
  onRemove: (id: number) => void;
  onUpdate: (id: number, patch: { rating?: number; note?: string }) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-white/90">Favorites</div>
        <div className="text-xs text-white/50">{favorites.length}</div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-white/60">
          Save a movie to track your rating and notes.
        </div>
      ) : (
        <div className="flex max-h-[72vh] flex-col gap-3 overflow-auto pr-1">
          {favorites.map((f) => {
            const img = posterUrl(f.poster_path);
            return (
              <div
                key={f.id}
                className="group grid grid-cols-[56px_1fr] gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.05]"
              >
                <div className="overflow-hidden rounded-lg border border-white/10">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={`${f.title} poster`}
                      className="h-20 w-14 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-14 items-center justify-center text-[10px] text-white/60">
                      No Poster
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {f.title}
                      </div>
                      <div className="text-xs text-white/50">
                        {(f.release_date || "").slice(0, 4) || "N/A"}
                      </div>
                    </div>

                    <button
                      className="rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs text-red-200 opacity-90 hover:bg-red-500/10"
                      onClick={() => onRemove(f.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <StarRating
                      value={f.rating}
                      onChange={(n) => onUpdate(f.id, { rating: n })}
                    />
                    <div className="text-xs text-white/40">
                      {new Date(f.savedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <input
                    className="mt-2 w-full rounded-lg border border-white/10 bg-zinc-950/60 p-2 text-sm text-white/85 placeholder:text-white/35 focus:border-white/20 focus:outline-none"
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
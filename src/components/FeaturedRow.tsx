"use client";

import type { TmdbMovie } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";

export function FeaturedRow({
  movies,
  isFavorite,
  onDetails,
  onToggleFav,
}: {
  movies: TmdbMovie[];
  isFavorite: (id: number) => boolean;
  onDetails: (m: TmdbMovie) => void;
  onToggleFav: (m: TmdbMovie) => void;
}) {
  if (movies.length === 0) return null;

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-white/90">Featured</div>
          <div className="text-xs text-white/50">
            Quick picks from your search
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 pr-1">
        {movies.map((m) => {
          const img = posterUrl(m.poster_path);
          const year = m.release_date ? m.release_date.slice(0, 4) : "N/A";
          const fav = isFavorite(m.id);

          return (
            <div
              key={m.id}
              className="group relative h-52 w-36 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={`${m.title} poster`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-white/50">
                  No Poster
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="truncate text-sm font-semibold">{m.title}</div>
                <div className="text-xs text-white/60">{year}</div>

                <div className="mt-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs hover:bg-white/15"
                    onClick={() => onDetails(m)}
                  >
                    Details
                  </button>
                  <button
                    className={[
                      "rounded-lg border px-2.5 py-1.5 text-xs",
                      fav
                        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200 hover:bg-yellow-300/15"
                        : "border-white/10 bg-white/10 text-white/85 hover:bg-white/15",
                    ].join(" ")}
                    onClick={() => onToggleFav(m)}
                  >
                    {fav ? "★ Saved" : "☆ Save"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
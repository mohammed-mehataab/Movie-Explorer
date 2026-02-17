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
          <div className="text-sm font-semibold text-soft">Featured</div>
          <div className="text-xs text-muted">Quick picks from your search</div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 pr-1 snap-x snap-mandatory scroll-smooth">
        {movies.map((m) => {
          const img = posterUrl(m.poster_path);
          const year = m.release_date ? m.release_date.slice(0, 4) : "N/A";
          const fav = isFavorite(m.id);

          return (
            <div
              key={m.id}
              className="mini-shell snap-start group relative h-52 w-36 shrink-0 overflow-hidden"
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={`${m.title} poster`}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                  No Poster
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="truncate text-sm font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                  {m.title}
                </div>
                <div className="text-xs text-white/75 [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                  {year}
                </div>

                <div className="mt-2 flex gap-2 opacity-100 md:opacity-0 transition md:group-hover:opacity-100">
                  <button
                    className="rounded-lg border border-white/10 bg-black/35 px-2.5 py-1.5 text-xs text-white backdrop-blur hover:bg-black/45"
                    onClick={() => onDetails(m)}
                  >
                    Details
                  </button>

                  <button
                    className={[
                      "rounded-lg border px-2.5 py-1.5 text-xs backdrop-blur shadow-[0_0_0_1px_rgba(0,0,0,0.35)]",
                      fav
                        ? "border-yellow-300/40 bg-yellow-300/20 text-yellow-100 hover:bg-yellow-300/25"
                        : "border-white/20 bg-black/35 text-white hover:bg-black/45",
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

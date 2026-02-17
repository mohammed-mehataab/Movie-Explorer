"use client";

import type { TmdbMovie } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";

export function MovieCard({
  movie,
  onOpen,
  isFav,
  onToggleFav,
}: {
  movie: TmdbMovie;
  onOpen: () => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const img = posterUrl(movie.poster_path);

  return (
    <div className="group movie-card-shell p-3">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={`${movie.title} poster`}
            className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center text-xs text-muted">
            No Poster
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                {movie.title}
              </div>
              <div className="text-xs text-white/75 [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                {year}
              </div>
            </div>

            <button
              className={[
                "rounded-xl border px-3 py-2 text-xs transition backdrop-blur",
                isFav
                  ? "border-yellow-300/40 bg-yellow-300/20 text-yellow-100 hover:bg-yellow-300/25"
                  : "border-white/25 bg-black/35 text-white hover:bg-black/45",
              ].join(" ")}
              onClick={onToggleFav}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              title={isFav ? "Saved" : "Save"}
            >
              {isFav ? "★" : "☆"}
            </button>
          </div>

          <div className="mt-3 flex gap-2 opacity-100 md:opacity-0 transition md:group-hover:opacity-100">
            <button
              className="rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-xs text-white backdrop-blur hover:bg-black/45"
              onClick={onOpen}
            >
              Details
            </button>
            <button
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/90 hover:bg-white/15"
              onClick={onToggleFav}
            >
              {isFav ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 clamp-2 text-sm text-muted">
        {movie.overview || "No description available."}
      </p>
    </div>
  );
}

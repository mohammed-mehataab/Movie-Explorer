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
    <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-3 transition hover:bg-white/[0.06]">
      <div className="relative overflow-hidden rounded-2xl border border-white/10">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={`${movie.title} poster`}
            className="h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center text-xs text-white/55">
            No Poster
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{movie.title}</div>
              <div className="text-xs text-white/60">{year}</div>
            </div>

            <button
              className={[
                "rounded-xl border px-3 py-2 text-xs transition",
                isFav
                  ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200 hover:bg-yellow-300/15"
                  : "border-white/10 bg-white/10 text-white/85 hover:bg-white/15",
              ].join(" ")}
              onClick={onToggleFav}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {isFav ? "★" : "☆"}
            </button>
          </div>

          <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs hover:bg-white/15"
              onClick={onOpen}
            >
              Details
            </button>
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
              onClick={onToggleFav}
            >
              {isFav ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

 <p className="mt-3 clamp-2 text-sm text-white/65">
        {movie.overview || "No description available."}
      </p>
    </div>
  );
}
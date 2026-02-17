"use client";

import { useEffect, useState } from "react";
import type { TmdbMovie, TmdbMovieDetails } from "@/lib/types";
import { posterUrl } from "@/lib/tmdb";

export function MovieDetailsModal({
  movie,
  open,
  onClose,
}: {
  movie: TmdbMovie | null;
  open: boolean;
  onClose: () => void;
}) {
  const [details, setDetails] = useState<TmdbMovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !movie) return;

    let cancelled = false;
    setLoading(true);
    setErr(null);
    setDetails(null);

    fetch(`/api/tmdb/movie/${movie.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((d) => !cancelled && setDetails(d))
      .catch(() => !cancelled && setErr("Could not load movie details. Try again."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [open, movie]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open || !movie) return null;

  const title = details?.title || movie.title;
  const year =
    (details?.release_date || movie.release_date || "").slice(0, 4) || "N/A";
  const runtime = details?.runtime ? `${details.runtime} min` : "N/A";
  const img = posterUrl(details?.poster_path ?? movie.poster_path);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div className="min-w-0">
            <div className="truncate text-xl font-bold">{title}</div>
            <div className="mt-1 text-sm text-white/60">
              {year} • Runtime: {runtime}
            </div>
          </div>

          <button
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {loading && <div className="p-5 text-sm text-white/70">Loading…</div>}
        {err && <div className="p-5 text-sm text-red-200">{err}</div>}

        {!loading && !err && (
          <div className="grid gap-5 p-5 md:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={`${title} poster`}
                  className="h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[420px] items-center justify-center text-xs text-white/60">
                  No Poster
                </div>
              )}
            </div>

            <div>
              <div className="text-sm font-semibold text-white/90">Overview</div>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {(details?.overview || movie.overview) || "No overview available."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
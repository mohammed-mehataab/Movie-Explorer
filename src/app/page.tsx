"use client";

import { useEffect, useMemo, useState } from "react";
import type { TmdbMovie } from "@/lib/types";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetailsModal } from "@/components/MovieDetailsModal";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { useDebounce } from "@/hooks/useDebounce";
import { MovieGridSkeleton } from "@/components/MovieGridSkeleton";
import { Toast } from "@/components/Toast";
import { FeaturedRow } from "@/components/FeaturedRow";
import { ThemeToggle } from "@/components/ThemeToggle";

type SearchMovieResponseItem = {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  poster_path?: string | null;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query.trim(), 350);

  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [selected, setSelected] = useState<TmdbMovie | null>(null);
  const [open, setOpen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const {
    favorites,
    loaded: favLoaded,
    syncStatus,
    syncError,
    isFavorite,
    add,
    remove,
    update,
  } = useFavorites();

  const canSearch = debounced.length >= 2;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = document.getElementById("searchBox") as HTMLInputElement | null;
        el?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!canSearch) {
        setResults([]);
        setErr(null);
        return;
      }

      setLoading(true);
      setErr(null);

      try {
        const r = await fetch(`/api/tmdb/search?q=${encodeURIComponent(debounced)}`);
        const data = await r.json();

        if (!r.ok) {
          if (!cancelled) setErr(data?.error || "Search failed. Try again.");
          return;
        }

        const rawResults: SearchMovieResponseItem[] = Array.isArray(data?.results)
          ? data.results
          : [];

        const movies: TmdbMovie[] = rawResults.map((m) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          release_date: m.release_date,
          poster_path: m.poster_path,
        }));

        if (!cancelled) {
          setResults(movies);
          if (movies.length === 0) setErr("No results found.");
        }
      } catch {
        if (!cancelled) setErr("Network error. Check your connection.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debounced, canSearch]);

  function openDetails(m: TmdbMovie) {
    setSelected(m);
    setOpen(true);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  }

  const sortedResults = useMemo(() => {
    // Posters first
    return [...results].sort((a, b) => {
      const ap = a.poster_path ? 1 : 0;
      const bp = b.poster_path ? 1 : 0;
      return bp - ap;
    });
  }, [results]);

  const featured = useMemo(() => sortedResults.slice(0, 5), [sortedResults]);
  const resultsCount = sortedResults.length;
  const pillClass = "glow-pill px-3 py-2 text-muted";

  return (
    <main className="app-bg">
      <Toast message={toast} />

      <div className="relative z-10 mx-auto max-w-6xl p-6">
        {/* HERO */}
        <section className="glass-shell p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Movie Explorer</h1>
              <p className="mt-1 text-sm text-muted">
                Search, open details, save favorites, rate, and leave notes.
              </p>
            </div>

            {/* TOP RIGHT CONTROLS */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <ThemeToggle />

              <div className={pillClass}>
                Results:{" "}
                <span className="text-soft">
                  {loading ? "…" : resultsCount}
                </span>
              </div>

              <div className={pillClass}>
                Favorites:{" "}
                <span className="text-soft">
                  {favorites.length}
                </span>
              </div>

              <div className={`${pillClass} hidden md:block`}>⌘K to search</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="relative w-full">
              <input
                id="searchBox"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title (min 2 chars)…"
                className="search-control w-full p-4 pr-28 text-sm outline-none"
              />

              {query.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="btn absolute right-16 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs"
                >
                  Clear
                </button>
              )}

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
                {loading ? "Searching…" : "Enter"}
              </div>
            </div>
          </div>

          {err && (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-200">
              {err}
            </div>
          )}

          {!loading && !err && featured.length > 0 && (
            <FeaturedRow
              movies={featured}
              isFavorite={isFavorite}
              onDetails={openDetails}
              onToggleFav={(m) => {
                const fav = isFavorite(m.id);
                if (fav) {
                  remove(m.id);
                  showToast("Removed from favorites");
                } else {
                  add(m);
                  showToast("Saved to favorites");
                }
              }}
            />
          )}
        </section>

        {/* CONTENT */}
        <section className="mt-6 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          <div>
            {loading ? (
              <MovieGridSkeleton />
            ) : resultsCount > 0 ? (
              <>
                <div className="mb-3 flex items-end justify-between">
                  <div className="text-sm font-semibold text-soft">
                    All Results
                  </div>
                  <div className="text-xs text-muted">
                    {resultsCount} items
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedResults.map((m) => {
                    const fav = isFavorite(m.id);
                    return (
                      <MovieCard
                        key={m.id}
                        movie={m}
                        onOpen={() => openDetails(m)}
                        isFav={fav}
                        onToggleFav={() => {
                          if (fav) {
                            remove(m.id);
                            showToast("Removed from favorites");
                          } else {
                            add(m);
                            showToast("Saved to favorites");
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="glass-shell p-10 text-center">
                <div className="text-lg font-semibold text-soft">Search something</div>
                <div className="mt-2 text-sm text-muted">
                  Try “Inception”, “Batman”, or whatever your taste is.
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 lg:h-fit">
            {!favLoaded ? (
              <div className="glass-shell p-4 text-sm text-muted">
                Loading favorites…
              </div>
            ) : (
              <FavoritesPanel
                favorites={favorites}
                syncStatus={syncStatus}
                syncError={syncError}
                onRemove={(id) => {
                  remove(id);
                  showToast("Removed from favorites");
                }}
                onUpdate={update}
              />
            )}
          </aside>
        </section>

        <MovieDetailsModal movie={selected} open={open} onClose={() => setOpen(false)} />
      </div>
    </main>
  );
}

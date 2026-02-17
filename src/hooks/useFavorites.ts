"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Favorite, TmdbMovie } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "movie_explorer_favorites_v1";
const USER_ID_KEY = "movie_explorer_user_id_v1";

type ServerFavorite = {
  id: number;
  movieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string | null;
  overview?: string | null;
  rating: number;
  note?: string;
  savedAt: string;
};

type SyncStatus = "idle" | "syncing" | "online" | "offline";

function normalizeRating(value: number) {
  return Math.min(5, Math.max(1, Math.round(value)));
}

function getOrCreateUserId() {
  const existing = window.localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `guest_${crypto.randomUUID()}`
      : `guest_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(USER_ID_KEY, generated);
  return generated;
}

function fromServer(item: ServerFavorite): Favorite {
  return {
    id: item.movieId ?? item.id,
    title: item.title,
    poster_path: item.posterPath ?? null,
    release_date: item.releaseDate ?? "",
    overview: item.overview ?? "",
    rating: normalizeRating(item.rating),
    note: item.note ?? "",
    savedAt: item.savedAt,
  };
}

function mergeFavorites(local: Favorite[], remote: Favorite[]) {
  const merged = new Map<number, Favorite>();

  for (const item of remote) merged.set(item.id, item);

  for (const item of local) {
    const existing = merged.get(item.id);
    if (!existing) {
      merged.set(item.id, item);
      continue;
    }

    const currentTs = new Date(existing.savedAt).getTime();
    const nextTs = new Date(item.savedAt).getTime();
    if (nextTs > currentTs) merged.set(item.id, item);
  }

  return [...merged.values()].sort((a, b) => {
    const aTs = new Date(a.savedAt).getTime();
    const bTs = new Date(b.savedAt).getTime();
    return bTs - aTs;
  });
}

export function useFavorites() {
  const { value: favorites, setValue: setFavorites, loaded } =
    useLocalStorage<Favorite[]>(STORAGE_KEY, []);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const [didHydrate, setDidHydrate] = useState(false);

  const byId = useMemo(() => {
    const map = new Map<number, Favorite>();
    favorites.forEach((f) => map.set(f.id, f));
    return map;
  }, [favorites]);

  useEffect(() => {
    if (!loaded) return;
    try {
      setUserId(getOrCreateUserId());
    } catch {
      setUserId(null);
      setSyncStatus("offline");
      setSyncError("Could not initialize server sync.");
    }
  }, [loaded]);

  const syncRequest = useCallback(async (
    method: "POST" | "PATCH" | "DELETE",
    payload: Record<string, unknown>
  ) => {
    if (!userId) return;
    const currentUserId = userId;

    try {
      const res = await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, ...payload }),
      });

      if (!res.ok) throw new Error("sync failed");

      setSyncStatus("online");
      setSyncError(null);
    } catch {
      setSyncStatus("offline");
      setSyncError("Server sync unavailable. Changes are saved locally.");
    }
  }, [userId]);

  useEffect(() => {
    if (!loaded || !userId || didHydrate) return;
    const currentUserId = userId;

    let cancelled = false;

    async function hydrateFromServer() {
      setSyncStatus("syncing");

      try {
        const res = await fetch(
          `/api/favorites?userId=${encodeURIComponent(currentUserId)}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load favorites.");
        }

        const serverItems: ServerFavorite[] = Array.isArray(data?.items)
          ? data.items
          : [];

        if (!cancelled) {
          const serverFavorites = serverItems.map(fromServer);
          const serverIds = new Set(serverFavorites.map((item) => item.id));

          setFavorites((current) => {
            const localOnly = current.filter((item) => !serverIds.has(item.id));

            for (const item of localOnly) {
              void syncRequest("POST", {
                movieId: item.id,
                title: item.title,
                posterPath: item.poster_path ?? null,
                releaseDate: item.release_date ?? null,
                overview: item.overview ?? null,
                rating: item.rating,
                note: item.note ?? "",
              });
            }

            return mergeFavorites(current, serverFavorites);
          });

          setSyncStatus("online");
          setSyncError(null);
          setDidHydrate(true);
        }
      } catch {
        if (!cancelled) {
          setSyncStatus("offline");
          setSyncError("Server sync unavailable. Using local storage only.");
          setDidHydrate(true);
        }
      }
    }

    hydrateFromServer();
    return () => {
      cancelled = true;
    };
  }, [didHydrate, loaded, setFavorites, syncRequest, userId]);

  function isFavorite(id: number) {
    return byId.has(id);
  }

  function add(movie: TmdbMovie) {
    const fav: Favorite = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path ?? null,
      release_date: movie.release_date,
      overview: movie.overview,
      rating: 3,
      note: "",
      savedAt: new Date().toISOString(),
    };

    setFavorites((current) => {
      if (current.some((item) => item.id === movie.id)) return current;
      return [fav, ...current];
    });

    void syncRequest("POST", {
      movieId: fav.id,
      title: fav.title,
      posterPath: fav.poster_path ?? null,
      releaseDate: fav.release_date ?? null,
      overview: fav.overview ?? null,
      rating: fav.rating,
      note: fav.note ?? "",
    });
  }

  function remove(id: number) {
    setFavorites((current) => current.filter((item) => item.id !== id));
    void syncRequest("DELETE", { movieId: id });
  }

  function update(id: number, patch: Partial<Pick<Favorite, "rating" | "note">>) {
    const nextPatch = {
      ...(patch.rating !== undefined ? { rating: normalizeRating(patch.rating) } : {}),
      ...(patch.note !== undefined ? { note: patch.note } : {}),
    };

    setFavorites((current) =>
      current.map((item) => (item.id === id ? { ...item, ...nextPatch } : item))
    );

    void syncRequest("PATCH", { movieId: id, ...nextPatch });
  }

  return {
    favorites,
    loaded,
    syncStatus,
    syncError,
    isFavorite,
    add,
    remove,
    update,
  };
}

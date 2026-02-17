"use client";

import { useMemo } from "react";
import type { Favorite, TmdbMovie } from "@/lib/types";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "movie_explorer_favorites_v1";

export function useFavorites() {
  const { value: favorites, setValue: setFavorites, loaded } =
    useLocalStorage<Favorite[]>(STORAGE_KEY, []);

  const byId = useMemo(() => {
    const map = new Map<number, Favorite>();
    favorites.forEach((f) => map.set(f.id, f));
    return map;
  }, [favorites]);

  function isFavorite(id: number) {
    return byId.has(id);
  }

  function add(movie: TmdbMovie) {
    if (byId.has(movie.id)) return;

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

    setFavorites([fav, ...favorites]);
  }

  function remove(id: number) {
    setFavorites(favorites.filter((f) => f.id !== id));
  }

  function update(id: number, patch: Partial<Pick<Favorite, "rating" | "note">>) {
    setFavorites(favorites.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  return { favorites, loaded, isFavorite, add, remove, update };
}
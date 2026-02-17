"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "movie_explorer_theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore and fall back to system
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return initialTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function setAndPersist(next: Theme) {
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }

  function toggleTheme() {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }

  return { theme, setTheme: setAndPersist, toggleTheme };
}

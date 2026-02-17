"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDark = theme === "dark";

  const icon = hydrated ? (isDark ? "🌙" : "☀️") : "🌓";
  const label = hydrated ? (isDark ? "Dark" : "Light") : "Theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="pill flex h-[34px] min-w-[104px] items-center justify-center gap-1.5 px-3 text-xs font-medium hover:opacity-90"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="text-soft">{icon}</span>
      <span className="text-soft">{label}</span>
    </button>
  );
}

"use client";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "🌙 Dark" : "☀️ Light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="pill flex h-[34px] min-w-[104px] items-center justify-center gap-1.5 px-3 text-xs font-medium hover:opacity-90"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span suppressHydrationWarning className="text-soft">
        {label}
      </span>
    </button>
  );
}

"use client";

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] rounded-xl border border-white/10 bg-zinc-950/90 px-4 py-3 text-sm text-white shadow-lg backdrop-blur">
      {message}
    </div>
  );
}
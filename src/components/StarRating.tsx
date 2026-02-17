"use client";

export function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={[
              "text-lg leading-none transition",
              active ? "text-yellow-300" : "text-white/25 hover:text-white/50",
            ].join(" ")}
            aria-label={`Rate ${n} star`}
            title={`${n}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
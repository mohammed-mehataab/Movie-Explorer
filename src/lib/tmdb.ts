export function posterUrl(path?: string | null) {
  if (!path) return "";
  const base =
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || "https://image.tmdb.org/t/p/w500";
  return `${base}${path}`;
}
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }

  const key = process.env.TMDB_API_KEY;
  const base = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

  if (!key) {
    return NextResponse.json(
      { error: "Server misconfigured: TMDB_API_KEY missing" },
      { status: 500 }
    );
  }

  const url = `${base}/movie/${id}?api_key=${key}&language=en-US`;

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "TMDB request failed", details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Network error while contacting TMDB" },
      { status: 502 }
    );
  }
}
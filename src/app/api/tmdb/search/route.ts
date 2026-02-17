import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json(
      { error: "Missing query parameter: q" },
      { status: 400 }
    );
  }

  const key = process.env.TMDB_API_KEY;
  const base = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

  if (!key) {
    return NextResponse.json(
      { error: "Server misconfigured: TMDB_API_KEY missing" },
      { status: 500 }
    );
  }

  const url = new URL(`${base}/search/movie`);
  url.searchParams.set("api_key", key);
  url.searchParams.set("query", q);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", "1");

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });

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
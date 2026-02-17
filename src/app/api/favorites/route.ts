import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FavoriteRow = {
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  overview: string | null;
  rating: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function requirePrisma() {
  if (!prisma) return null;
  return prisma;
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function parseMovieId(value: unknown) {
  if (!Number.isInteger(value)) return null;
  return Number(value);
}

function parseRating(value: unknown) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const clamped = Math.min(5, Math.max(1, Math.round(numeric)));
  return clamped;
}

function serializeFavorite(item: FavoriteRow) {
  return {
    id: item.movieId,
    movieId: item.movieId,
    title: item.title,
    posterPath: item.posterPath,
    releaseDate: item.releaseDate,
    overview: item.overview,
    rating: item.rating,
    note: item.note ?? "",
    savedAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function GET(req: Request) {
  const db = requirePrisma();
  if (!db) return jsonError("Server persistence is not configured.", 503);

  const { searchParams } = new URL(req.url);
  const userId = normalizeString(searchParams.get("userId"));

  if (!userId) return jsonError("Missing userId");

  try {
    const items = await db.favorite.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        movieId: true,
        title: true,
        posterPath: true,
        releaseDate: true,
        overview: true,
        rating: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ items: items.map(serializeFavorite) });
  } catch {
    return jsonError("Could not load favorites from server.", 500);
  }
}

export async function POST(req: Request) {
  const db = requirePrisma();
  if (!db) return jsonError("Server persistence is not configured.", 503);

  const body = await req.json().catch(() => null);

  const userId = normalizeString(body?.userId);
  const movieId = parseMovieId(body?.movieId);
  const title = normalizeString(body?.title);
  const posterPath = normalizeString(body?.posterPath) || null;
  const releaseDate = normalizeString(body?.releaseDate) || null;
  const overview = normalizeString(body?.overview) || null;
  const rating = parseRating(body?.rating ?? 3);
  const note = normalizeString(body?.note) || null;

  if (!userId || movieId === null || !title || rating === null) {
    return jsonError("Missing required fields.");
  }

  try {
    const item = await db.favorite.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { title, posterPath, releaseDate, overview, rating, note },
      create: {
        userId,
        movieId,
        title,
        posterPath,
        releaseDate,
        overview,
        rating,
        note,
      },
      select: {
        movieId: true,
        title: true,
        posterPath: true,
        releaseDate: true,
        overview: true,
        rating: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ item: serializeFavorite(item) });
  } catch {
    return jsonError("Could not save favorite on server.", 500);
  }
}

export async function PATCH(req: Request) {
  const db = requirePrisma();
  if (!db) return jsonError("Server persistence is not configured.", 503);

  const body = await req.json().catch(() => null);

  const userId = normalizeString(body?.userId);
  const movieId = parseMovieId(body?.movieId);
  const rating = body?.rating === undefined ? undefined : parseRating(body.rating);
  const note = body?.note === undefined ? undefined : normalizeString(body.note);

  if (!userId || movieId === null) {
    return jsonError("Missing required fields.");
  }

  if (rating === null) {
    return jsonError("Rating must be between 1 and 5.");
  }

  if (rating === undefined && note === undefined) {
    return jsonError("Nothing to update.");
  }

  try {
    const item = await db.favorite.update({
      where: { userId_movieId: { userId, movieId } },
      data: {
        ...(rating !== undefined ? { rating } : {}),
        ...(note !== undefined ? { note: note || null } : {}),
      },
      select: {
        movieId: true,
        title: true,
        posterPath: true,
        releaseDate: true,
        overview: true,
        rating: true,
        note: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ item: serializeFavorite(item) });
  } catch {
    return jsonError("Favorite not found.", 404);
  }
}

export async function DELETE(req: Request) {
  const db = requirePrisma();
  if (!db) return jsonError("Server persistence is not configured.", 503);

  const body = await req.json().catch(() => null);

  const userId = normalizeString(body?.userId);
  const movieId = parseMovieId(body?.movieId);

  if (!userId || movieId === null) {
    return jsonError("Missing required fields.");
  }

  try {
    await db.favorite.delete({
      where: { userId_movieId: { userId, movieId } },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return jsonError("Favorite not found.", 404);
  }
}

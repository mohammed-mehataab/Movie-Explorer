# Movie Explorer

A simple movie app built with Next.js.

You can:
- Search movies by title
- Open movie details (poster, overview, runtime, year)
- Save favorites
- Add your own rating (1-5) and note

Favorites are always saved in LocalStorage.  
If database config is present, favorites also sync to the server.

## Live URL

https://movieexplorer-jet.vercel.app/

## Tech

- Next.js (App Router) + TypeScript
- TMDB API (through Next.js API routes)
- Prisma + PostgreSQL (optional server persistence)

## Run locally

1. Install:
```bash
npm install
```

2. Add `.env.local`:
```bash
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
DATABASE_URL=your_database_url
```

3. Prepare Prisma:
```bash
npm run db:generate
npm run db:push
```

4. Start:
```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- If `TMDB_API_KEY` is missing, search will fail.
- If `DATABASE_URL` is missing, app still works with LocalStorage (local-only mode).

## Quick decisions

- API key is kept server-side using proxy routes.
- State management is kept simple with React hooks.
- UI is intentionally lightweight and focused on core flow.

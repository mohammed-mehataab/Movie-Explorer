# Movie Explorer

Movie Explorer is a Next.js take-home project where users can:
- Search movies by title
- Open a details view for runtime/overview
- Save favorites
- Add a personal rating (1-5) and note

This implementation includes both:
- Baseline persistence with LocalStorage
- Optional server-side persistence with a database-backed API route

## Hosted App
- https://movieexplorer-jet.vercel.app/

## Tech Stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- TMDB API via server-side proxy routes
- Prisma + PostgreSQL for optional server-side favorites persistence

## Setup & Run
1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` (or update existing) with:
```bash
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
DATABASE_URL=your_database_connection_string
```

3. Generate Prisma client and sync schema:
```bash
npx prisma generate
npx prisma db push
```

4. Start the app:
```bash
npm run dev
```

5. Open:
- http://localhost:3000

## API Routes
- `GET /api/tmdb/search?q=...`:
  Server-side TMDB search proxy (keeps API key off the client)
- `GET /api/tmdb/movie/:id`:
  Server-side TMDB details proxy
- `GET /api/favorites?userId=...`:
  Fetch persisted favorites for a user id
- `POST /api/favorites`:
  Upsert a favorite
- `PATCH /api/favorites`:
  Update rating/note
- `DELETE /api/favorites`:
  Remove a favorite

## Technical Decisions & Tradeoffs
- API proxy:
  TMDB calls are routed through Next.js API routes so secrets are not exposed in browser requests.
- State management:
  Local component/hook state was chosen over Redux/Zustand to keep complexity low for a 3-hour scope.
- Persistence:
  Favorites are always kept in LocalStorage (baseline requirement). The app then attempts server sync in the background (optional requirement).
- Server sync strategy:
  Optimistic local updates keep the UI fast. Failed server syncs do not block user actions and fall back gracefully to local-only mode.

## Known Limitations
- No full auth system; user identity is generated client-side and stored locally.
- Notes save immediately on each change, which can create frequent PATCH requests.
- Database setup is required to enable server persistence in local/dev environments.

## If I Had More Time
1. Add authentication (Clerk/Auth.js) so favorites are tied to real user accounts.
2. Add debounced note updates and retry queue for failed sync writes.
3. Add tests (unit + API route integration + e2e flows).
4. Improve mobile layout polish and accessibility details (focus traps, ARIA announcements).

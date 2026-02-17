# Movie Explorer

A simple Movie Explorer web app where you can search movies, open a details view, and save favorites with your own rating + note. Built as a fast working prototype (focused on core functionality over heavy UI polish).

## Live Demo
- Deployed App: https://movieexplorer-jet.vercel.app/

## Features
- **Search by title** (shows poster, title, year, short overview)
- **Movie details modal** (poster, overview, year, runtime when available)
- **Favorites list**
  - Add / remove movies
  - Set **rating (1–5 stars)**
  - Add an optional **personal note**
- **Persistence**
  - Favorites are stored in **LocalStorage**, so they survive refresh
- **API Proxy**
  - Uses **Next.js API routes** to call TMDB so the API key is **never exposed in the browser**
- **Error handling**
  - Empty query
  - No results
  - Network / API failures

---

## Tech Stack
- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **TMDB API** (via server-side proxy routes)

---

## Setup (Local)

### 1) Clone and install
```bash
git clone https://github.com/mohammed-mehataab/Movie-Explorer.git
cd Movie-Explorer
npm install
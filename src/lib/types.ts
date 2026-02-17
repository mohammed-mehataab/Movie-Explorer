export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  release_date?: string;
  poster_path?: string | null;
};

export type TmdbMovieDetails = TmdbMovie & {
  runtime?: number | null;
};

export type Favorite = {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  overview?: string;
  rating: number; // 1-5
  note?: string;
  savedAt: string;
};
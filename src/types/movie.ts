export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  belongs_to_collection: Collection | null;
  credits?: Credits;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  credit_id: string;
  order: number;
  profile_path: string | null;
  adult: boolean;
  gender: number | null;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  credit_id: string;
  profile_path: string | null;
  adult: boolean;
  gender: number | null;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchParams {
  query?: string;
  page?: number;
  year?: number;
  genre?: string;
  sort_by?:
    | "popularity.desc"
    | "popularity.asc"
    | "release_date.desc"
    | "release_date.asc"
    | "vote_average.desc"
    | "vote_average.asc";
  vote_average_gte?: number;
  vote_average_lte?: number;
  with_genres?: string;
  primary_release_year?: number;
}

export interface ApiError {
  success: boolean;
  status_code: number;
  status_message: string;
}

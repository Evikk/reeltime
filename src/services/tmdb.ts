import type { MovieDetails, MovieResponse, Genre, SearchParams, ApiError } from "@/types/movie";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "demo_key";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

class TMDbService {
  private async fetchApi<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {}
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);

    const searchParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    });

    url.search = searchParams.toString();

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.status_message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("TMDb API Error:", error);
      throw error;
    }
  }

  async getPopularMovies(page = 1): Promise<MovieResponse> {
    return this.fetchApi<MovieResponse>("/movie/popular", { page });
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<MovieResponse> {
    return this.fetchApi<MovieResponse>("/movie/top_rated", { page });
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1): Promise<MovieResponse> {
    return this.fetchApi<MovieResponse>("/movie/now_playing", { page });
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1): Promise<MovieResponse> {
    return this.fetchApi<MovieResponse>("/movie/upcoming", { page });
  }

  // Search movies
  async searchMovies(query: string, page = 1): Promise<MovieResponse> {
    if (!query.trim()) {
      throw new Error("Search query cannot be empty");
    }

    return this.fetchApi<MovieResponse>("/search/movie", {
      query: query.trim(),
      page,
      include_adult: false,
    });
  }

  // Fetch movies with filters
  async discoverMovies(params: SearchParams = {}): Promise<MovieResponse> {
    const {
      page = 1,
      sort_by = "popularity.desc",
      year,
      genre,
      vote_average_gte,
      vote_average_lte,
      with_genres,
      primary_release_year,
    } = params;

    const searchParams: Record<string, string | number | boolean> = {
      page,
      sort_by,
      include_adult: false,
      include_video: false,
    };

    if (year) searchParams.year = year;
    if (genre) searchParams.with_genres = genre;
    if (vote_average_gte) searchParams["vote_average.gte"] = vote_average_gte;
    if (vote_average_lte) searchParams["vote_average.lte"] = vote_average_lte;
    if (with_genres) searchParams.with_genres = with_genres;
    if (primary_release_year) searchParams.primary_release_year = primary_release_year;

    return this.fetchApi<MovieResponse>("/discover/movie", searchParams);
  }

  // Fetch movie details
  async getMovieDetails(id: number): Promise<MovieDetails> {
    return this.fetchApi<MovieDetails>(`/movie/${id}`, {
      append_to_response: "credits,videos,recommendations,similar",
    });
  }

  // Fetch movie credits
  async getMovieCredits(id: number) {
    return this.fetchApi(`/movie/${id}/credits`);
  }

  // Fetch genres list
  async getGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchApi<{ genres: Genre[] }>("/genre/movie/list");
  }

  // Fetch trending movies
  async getTrendingMovies(timeWindow: "day" | "week" = "week", page = 1): Promise<MovieResponse> {
    return this.fetchApi<MovieResponse>(`/trending/movie/${timeWindow}`, { page });
  }

  // Utility methods for image URLs
  getPosterUrl(
    posterPath: string | null,
    size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
  ): string | null {
    if (!posterPath) return null;
    return `${IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  getBackdropUrl(
    backdropPath: string | null,
    size: "w300" | "w780" | "w1280" | "original" = "w1280"
  ): string | null {
    if (!backdropPath) return null;
    return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
  }

  getProfileUrl(
    profilePath: string | null,
    size: "w45" | "w185" | "h632" | "original" = "w185"
  ): string | null {
    if (!profilePath) return null;
    return `${IMAGE_BASE_URL}/${size}${profilePath}`;
  }

  // Format runtime to hours and minutes
  formatRuntime(minutes: number): string {
    if (!minutes) return "Unknown";

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;

    return `${hours}h ${remainingMinutes}m`;
  }

  // Format currency
  formatCurrency(amount: number): string {
    if (!amount) return "Unknown";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format date
  formatDate(dateString: string): string {
    if (!dateString) return "Unknown";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  }

  // Get year from date string
  getYear(dateString: string): number | null {
    if (!dateString) return null;

    try {
      return new Date(dateString).getFullYear();
    } catch {
      return null;
    }
  }
}

export default new TMDbService();

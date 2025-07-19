import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Movie, MovieResponse, Genre, SearchParams } from "@/types/movie";
import tmdbService from "@/services/tmdb";

export const useMoviesStore = defineStore("movies", () => {
  const movies = ref<Movie[]>([]);
  const searchResults = ref<Movie[]>([]);
  const genres = ref<Genre[]>([]);
  const currentPage = ref(1);
  const totalPages = ref(0);
  const totalResults = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const isSearchMode = ref(false);

  const filters = ref<SearchParams>({
    sort_by: "popularity.desc",
    year: undefined,
    genre: undefined,
    vote_average_gte: undefined,
    vote_average_lte: undefined,
  });

  const currentCategory = ref<"popular" | "top_rated" | "now_playing" | "upcoming" | "trending">(
    "popular"
  );

  const currentMovies = computed(() => {
    return isSearchMode.value ? searchResults.value : movies.value;
  });

  const hasMovies = computed(() => {
    return currentMovies.value.length > 0;
  });

  const hasMorePages = computed(() => {
    return currentPage.value < totalPages.value;
  });

  const genreMap = computed(() => {
    const map = new Map<number, string>();
    genres.value.forEach((genre) => {
      map.set(genre.id, genre.name);
    });
    return map;
  });

  async function fetchGenres() {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await tmdbService.getGenres();
      genres.value = response.genres;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch genres";
      console.error("Error fetching genres:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMoviesByCategory(
    category: typeof currentCategory.value,
    page = 1,
    append = false
  ) {
    try {
      isLoading.value = true;
      error.value = null;

      let response: MovieResponse;

      switch (category) {
        case "popular":
          response = await tmdbService.getPopularMovies(page);
          break;
        case "top_rated":
          response = await tmdbService.getTopRatedMovies(page);
          break;
        case "now_playing":
          response = await tmdbService.getNowPlayingMovies(page);
          break;
        case "upcoming":
          response = await tmdbService.getUpcomingMovies(page);
          break;
        case "trending":
          response = await tmdbService.getTrendingMovies("week", page);
          break;
        default:
          response = await tmdbService.getPopularMovies(page);
      }

      currentCategory.value = category;
      currentPage.value = response.page;
      totalPages.value = response.total_pages;
      totalResults.value = response.total_results;

      if (append) {
        movies.value = [...movies.value, ...response.results];
      } else {
        movies.value = response.results;
      }

      isSearchMode.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch movies";
      console.error("Error fetching movies:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function searchMovies(query: string, page = 1, append = false) {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;

      const response = await tmdbService.searchMovies(query.trim(), page);

      searchQuery.value = query.trim();
      currentPage.value = response.page;
      totalPages.value = response.total_pages;
      totalResults.value = response.total_results;

      if (append) {
        searchResults.value = [...searchResults.value, ...response.results];
      } else {
        searchResults.value = response.results;
      }

      isSearchMode.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to search movies";
      console.error("Error searching movies:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function discoverMovies(searchParams: SearchParams = {}, page = 1, append = false) {
    try {
      isLoading.value = true;
      error.value = null;

      const params = { ...filters.value, ...searchParams, page };
      const response = await tmdbService.discoverMovies(params);

      currentPage.value = response.page;
      totalPages.value = response.total_pages;
      totalResults.value = response.total_results;

      if (append) {
        movies.value = [...movies.value, ...response.results];
      } else {
        movies.value = response.results;
      }

      isSearchMode.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to discover movies";
      console.error("Error discovering movies:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMoreMovies() {
    if (!hasMorePages.value || isLoading.value) return;

    const nextPage = currentPage.value + 1;

    if (isSearchMode.value && searchQuery.value) {
      await searchMovies(searchQuery.value, nextPage, true);
    } else {
      await fetchMoviesByCategory(currentCategory.value, nextPage, true);
    }
  }

  function updateFilters(newFilters: Partial<SearchParams>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function clearFilters() {
    filters.value = {
      sort_by: "popularity.desc",
      year: undefined,
      genre: undefined,
      vote_average_gte: undefined,
      vote_average_lte: undefined,
    };
  }

  function clearSearch() {
    searchQuery.value = "";
    searchResults.value = [];
    isSearchMode.value = false;
    currentPage.value = 1;
    totalPages.value = 0;
    totalResults.value = 0;
  }

  function clearError() {
    error.value = null;
  }

  function getGenreName(genreId: number): string {
    return genreMap.value.get(genreId) || "Unknown";
  }

  function getMovieGenres(movie: Movie): string[] {
    return movie.genre_ids.map((id) => getGenreName(id));
  }

  async function initialize() {
    await Promise.all([fetchGenres(), fetchMoviesByCategory("popular")]);
  }

  return {
    movies,
    searchResults,
    genres,
    currentPage,
    totalPages,
    totalResults,
    isLoading,
    error,
    searchQuery,
    isSearchMode,
    filters,
    currentCategory,

    currentMovies,
    hasMovies,
    hasMorePages,
    genreMap,

    fetchGenres,
    fetchMoviesByCategory,
    searchMovies,
    discoverMovies,
    loadMoreMovies,
    updateFilters,
    clearFilters,
    clearSearch,
    clearError,
    getGenreName,
    getMovieGenres,
    initialize,
  };
});

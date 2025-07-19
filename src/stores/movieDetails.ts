import { defineStore } from "pinia";
import { ref } from "vue";
import type { MovieDetails } from "@/types/movie";
import tmdbService from "@/services/tmdb";

export const useMovieDetailsStore = defineStore("movieDetails", () => {
  const currentMovie = ref<MovieDetails | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchMovieDetails(id: number) {
    try {
      isLoading.value = true;
      error.value = null;

      const movieDetails = await tmdbService.getMovieDetails(id);
      currentMovie.value = movieDetails;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch movie details";
      console.error("Error fetching movie details:", err);
    } finally {
      isLoading.value = false;
    }
  }

  function clearCurrentMovie() {
    currentMovie.value = null;
  }

  function clearError() {
    error.value = null;
  }

  return {
    currentMovie,
    isLoading,
    error,
    fetchMovieDetails,
    clearCurrentMovie,
    clearError,
  };
});

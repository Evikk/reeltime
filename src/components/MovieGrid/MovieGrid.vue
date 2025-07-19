<template>
  <div class="movie-grid-container">
    <div v-if="isLoading && !hasMovies" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="ml-3 text-gray-600">Loading movies...</span>
    </div>

    <ErrorMessage
      v-else-if="error"
      title="Error Loading Movies"
      :message="error"
      :show-actions="true"
      @retry="retry"
    />

    <div v-else-if="hasMovies" class="space-y-6">
      <MovieGridHeader
        :total-results="totalResults"
        :is-search-mode="isSearchMode"
        :search-query="searchQuery"
        v-model:grid-columns="gridColumns"
      />

      <div
        :class="['movies-grid', gridColumns === 'compact' ? 'grid-compact' : 'grid-comfortable']"
      >
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @click="onMovieClick"
          class="fade-in"
        />
      </div>

      <div class="text-center py-8">
        <button v-if="hasMorePages && !isLoading" @click="loadMore" class="btn-primary">
          Load More Movies
        </button>

        <div v-else-if="isLoading && hasMovies" class="loading-container">
          <div class="loading-spinner"></div>
          <span class="ml-3 text-gray-600">Loading more movies...</span>
        </div>

        <p v-else-if="!hasMorePages && hasMovies" class="text-gray-500">
          You've reached the end of the results
        </p>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state-content">
        <FilmIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ emptyStateTitle }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ emptyStateMessage }}
        </p>
        <button v-if="isSearchMode" @click="clearSearch" class="btn-primary">
          Browse Popular Movies
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { FilmIcon } from "lucide-vue-next";
import MovieCard from "@/components/MovieGrid/MovieCard.vue";
import MovieGridHeader from "@/components/MovieGrid/MovieGridHeader.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { useMoviesStore } from "@/stores/movies";
import type { Movie } from "@/types/movie";

const router = useRouter();
const moviesStore = useMoviesStore();

const gridColumns = ref<"compact" | "comfortable">("comfortable");

const movies = computed(() => moviesStore.currentMovies);
const isLoading = computed(() => moviesStore.isLoading);
const error = computed(() => moviesStore.error);
const hasMovies = computed(() => moviesStore.hasMovies);
const hasMorePages = computed(() => moviesStore.hasMorePages);
const totalResults = computed(() => moviesStore.totalResults);
const isSearchMode = computed(() => moviesStore.isSearchMode);
const searchQuery = computed(() => moviesStore.searchQuery);

const emptyStateTitle = computed(() => {
  if (isSearchMode.value) {
    return "No movies found";
  }
  return "No movies available";
});

const emptyStateMessage = computed(() => {
  if (isSearchMode.value) {
    return `We couldn't find any movies matching "${searchQuery.value}". Try adjusting your search terms or filters.`;
  }
  return "There are no movies to display at the moment. Please try again later.";
});

function onMovieClick(movie: Movie) {
  router.push(`/movie/${movie.id}`);
}

async function loadMore() {
  await moviesStore.loadMoreMovies();
}

function clearSearch() {
  moviesStore.clearSearch();
  moviesStore.fetchMoviesByCategory("popular");
}

async function retry() {
  moviesStore.clearError();
  if (isSearchMode.value && searchQuery.value) {
    await moviesStore.searchMovies(searchQuery.value);
  } else {
    await moviesStore.fetchMoviesByCategory(moviesStore.currentCategory);
  }
}
</script>

<style scoped>
.movie-grid-container {
  min-height: 400px;
}
</style>

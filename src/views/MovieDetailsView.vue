<template>
  <div class="page-container">
    <LoadingSpinner v-if="isLoading" message="Loading movie details..." class="min-h-screen" />

    <ErrorMessage
      v-else-if="error"
      title="Error Loading Movie"
      :message="error"
      :show-actions="true"
      @retry="retry"
      @go-back="goBack"
    />

    <div v-else-if="movie" class="relative">
      <MovieHero :movie="movie" @go-back="goBack" />
      <div class="movie-details-container">
        <div class="movie-details-layout">
          <div class="movie-details-main">
            <MovieCast :movie="movie" />
            <MovieCrew :movie="movie" />
          </div>
          <MovieDetailsSidebar :movie="movie" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMovieDetailsStore } from "@/stores/movieDetails";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import MovieHero from "@/components/MovieDetails/MovieHero.vue";
import MovieCast from "@/components/MovieDetails/MovieCast.vue";
import MovieCrew from "@/components/MovieDetails/MovieCrew.vue";
import MovieDetailsSidebar from "@/components/MovieDetails/MovieDetailsSidebar.vue";

const route = useRoute();
const router = useRouter();
const movieDetailsStore = useMovieDetailsStore();

// Store state
const movie = computed(() => movieDetailsStore.currentMovie);
const isLoading = computed(() => movieDetailsStore.isLoading);
const error = computed(() => movieDetailsStore.error);

// Methods
function goBack() {
  router.go(-1);
}

async function retry() {
  const movieId = parseInt(route.params.id as string);
  if (movieId) {
    movieDetailsStore.clearError();
    await movieDetailsStore.fetchMovieDetails(movieId);
  }
}

// Initialize
onMounted(async () => {
  const movieId = parseInt(route.params.id as string);
  if (movieId) {
    await movieDetailsStore.fetchMovieDetails(movieId);
  } else {
    router.push("/");
  }
});
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}
</style>

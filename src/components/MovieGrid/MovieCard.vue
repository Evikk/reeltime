<template>
  <div
    class="movie-card group"
    @click="$emit('click', movie)"
    @keydown.enter="$emit('click', movie)"
    @keydown.space.prevent="$emit('click', movie)"
    tabindex="0"
    role="button"
    :aria-label="`View details for ${movie.title}`"
  >
    <div class="movie-poster-container">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="`${movie.title} poster`"
        class="movie-poster"
        loading="lazy"
        @error="onImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-300">
        <FilmIcon class="w-16 h-16 text-gray-500" />
      </div>

      <div v-if="movie.vote_average > 0" class="rating-badge">⭐ {{ rating }}</div>

      <div v-if="releaseYear" class="year-badge">
        {{ releaseYear }}
      </div>

      <div
        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
      >
        <PlayIcon
          class="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>

    <div class="movie-info">
      <h3 class="movie-title">
        {{ movie.title }}
      </h3>

      <div v-if="genres.length > 0" class="movie-genres">
        <span v-for="genre in genres.slice(0, 3)" :key="genre" class="genre-tag">
          {{ genre }}
        </span>
        <span v-if="genres.length > 3" class="genre-tag"> +{{ genres.length - 3 }} </span>
      </div>

      <p v-if="movie.overview" class="movie-overview">
        {{ movie.overview }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FilmIcon, PlayIcon } from "lucide-vue-next";
import type { Movie } from "@/types/movie";
import tmdbService from "@/services/tmdb";
import { useMoviesStore } from "@/stores/movies";

interface Props {
  movie: Movie;
}

const props = defineProps<Props>();
defineEmits<{
  click: [movie: Movie];
}>();

const moviesStore = useMoviesStore();
const imageError = ref(false);

const posterUrl = computed(() => {
  if (imageError.value) return null;
  return tmdbService.getPosterUrl(props.movie.poster_path, "w342");
});

const rating = computed(() => {
  return Math.round(props.movie.vote_average * 10) / 10;
});

const releaseYear = computed(() => {
  return tmdbService.getYear(props.movie.release_date);
});

const genres = computed(() => {
  return moviesStore.getMovieGenres(props.movie);
});

function onImageError() {
  imageError.value = true;
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

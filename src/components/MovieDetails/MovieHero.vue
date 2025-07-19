<template>
  <div class="movie-hero">
    <div
      v-if="backdropUrl"
      class="movie-hero-backdrop"
      :style="{ backgroundImage: `url(${backdropUrl})` }"
    >
      <div class="movie-hero-gradient"></div>
    </div>

    <div v-else class="movie-hero-fallback"></div>

    <div class="movie-hero-controls">
      <button @click="$emit('goBack')" class="movie-hero-back-btn">
        <ArrowLeftIcon class="w-5 h-5" />
        Back
      </button>

      <ThemeToggle />
    </div>

    <div class="movie-hero-content">
      <div class="movie-hero-layout">
        <div class="movie-hero-poster">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="`${movie.title} poster`"
            class="movie-hero-poster-img"
            loading="lazy"
          />
          <div v-else class="movie-hero-poster-placeholder">
            <FilmIcon class="w-16 h-16 text-gray-500" />
          </div>
        </div>

        <div class="movie-hero-info">
          <h1 class="movie-hero-title">{{ movie.title || "Unknown Title" }}</h1>

          <div class="movie-hero-meta">
            <span v-if="year" class="movie-hero-meta-item">
              <CalendarIcon class="w-5 h-5" />
              {{ year }}
            </span>
            <span v-if="runtime" class="movie-hero-meta-item">
              <ClockIcon class="w-5 h-5" />
              {{ runtime }}
            </span>
            <div v-if="rating > 0" class="movie-hero-rating">
              <StarIcon class="w-5 h-5 fill-current" />
              {{ rating }}/10
            </div>
          </div>

          <div v-if="genres.length > 0" class="movie-hero-genres">
            <span v-for="genre in genres" :key="genre.id" class="movie-hero-genre-tag">
              {{ genre.name }}
            </span>
          </div>

          <p v-if="movie.tagline" class="movie-hero-tagline">"{{ movie.tagline }}"</p>

          <p v-if="movie.overview" class="movie-hero-overview">
            {{ movie.overview }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeftIcon, FilmIcon, CalendarIcon, ClockIcon, StarIcon } from "lucide-vue-next";
import ThemeToggle from "@/components/AppHeader/ThemeToggle.vue";
import tmdbService from "@/services/tmdb";
import type { MovieDetails } from "@/types/movie";

interface Props {
  movie: MovieDetails;
}

interface Emits {
  goBack: [];
}

const props = defineProps<Props>();
defineEmits<Emits>();

// Computed properties
const posterUrl = computed(() =>
  props.movie.poster_path ? tmdbService.getPosterUrl(props.movie.poster_path, "w500") : null
);

const backdropUrl = computed(() =>
  props.movie.backdrop_path ? tmdbService.getBackdropUrl(props.movie.backdrop_path, "w1280") : null
);

const year = computed(() =>
  props.movie.release_date ? tmdbService.getYear(props.movie.release_date) : null
);

const runtime = computed(() =>
  props.movie.runtime ? tmdbService.formatRuntime(props.movie.runtime) : null
);

const rating = computed(() => {
  if (!props.movie.vote_average) return 0;
  return Math.round(props.movie.vote_average * 10) / 10;
});

const genres = computed(() => props.movie.genres || []);
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
}
</style>

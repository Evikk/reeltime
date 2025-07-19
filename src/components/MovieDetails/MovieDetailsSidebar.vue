<template>
  <div class="movie-details-sidebar">
    <!-- Movie Details Card -->
    <div class="card">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Movie Details</h3>
      <dl class="movie-details-list">
        <div v-if="releaseDate" class="movie-detail-item">
          <dt>Release Date</dt>
          <dd>{{ releaseDate }}</dd>
        </div>
        <div v-if="budget !== 'Unknown'" class="movie-detail-item">
          <dt>Budget</dt>
          <dd>{{ budget }}</dd>
        </div>
        <div v-if="revenue !== 'Unknown'" class="movie-detail-item">
          <dt>Revenue</dt>
          <dd>{{ revenue }}</dd>
        </div>
        <div v-if="movie.status" class="movie-detail-item">
          <dt>Status</dt>
          <dd>{{ movie.status }}</dd>
        </div>
        <div v-if="movie.original_language" class="movie-detail-item">
          <dt>Original Language</dt>
          <dd>{{ movie.original_language.toUpperCase() }}</dd>
        </div>
        <div v-if="voteCount > 0" class="movie-detail-item">
          <dt>Vote Count</dt>
          <dd>{{ voteCount.toLocaleString() }}</dd>
        </div>
      </dl>
    </div>

    <!-- Links Card -->
    <div v-if="movie.homepage || imdbUrl" class="card">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Links</h3>
      <div class="movie-links">
        <a
          v-if="movie.homepage"
          :href="movie.homepage"
          target="_blank"
          rel="noopener noreferrer"
          class="movie-external-link"
        >
          <ExternalLinkIcon class="w-4 h-4" />
          Official Website
        </a>
        <a
          v-if="imdbUrl"
          :href="imdbUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="movie-external-link"
        >
          <ExternalLinkIcon class="w-4 h-4" />
          IMDb
        </a>
      </div>
    </div>

    <!-- Production Companies Card -->
    <div v-if="productionCompanies.length > 0" class="card">
      <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Production</h3>
      <div class="production-companies">
        <p
          v-for="company in productionCompanies.slice(0, 5)"
          :key="company.id"
          class="production-company"
        >
          {{ company.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ExternalLinkIcon } from "lucide-vue-next";
import tmdbService from "@/services/tmdb";
import type { MovieDetails } from "@/types/movie";

interface Props {
  movie: MovieDetails;
}

const props = defineProps<Props>();

// Computed properties
const releaseDate = computed(() =>
  props.movie.release_date ? tmdbService.formatDate(props.movie.release_date) : null
);

const budget = computed(() =>
  props.movie.budget ? tmdbService.formatCurrency(props.movie.budget) : "Unknown"
);

const revenue = computed(() =>
  props.movie.revenue ? tmdbService.formatCurrency(props.movie.revenue) : "Unknown"
);

const voteCount = computed(() => props.movie.vote_count || 0);

const productionCompanies = computed(() => props.movie.production_companies || []);

const imdbUrl = computed(() => {
  const imdbId = props.movie.imdb_id;
  return imdbId ? `https://www.imdb.com/title/${imdbId}` : null;
});
</script>

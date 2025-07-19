<template>
  <section v-if="directors.length > 0" class="movie-section">
    <h2 class="movie-section-title">
      <ClapperboardIcon class="w-6 h-6" />
      {{ directors.length === 1 ? "Director" : "Directors" }}
    </h2>
    <div class="movie-crew-tags">
      <span v-for="director in directors" :key="director" class="crew-tag">
        {{ director }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ClapperboardIcon } from "lucide-vue-next";
import type { MovieDetails } from "@/types/movie";

interface Props {
  movie: MovieDetails;
}

const props = defineProps<Props>();

// Computed properties
const directors = computed(() => {
  if (!props.movie.credits?.crew) return [];
  return props.movie.credits.crew
    .filter((person) => person.job === "Director")
    .map((director) => director.name);
});
</script>

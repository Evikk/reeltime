<template>
  <section v-if="cast.length > 0" class="movie-section">
    <h2 class="movie-section-title">
      <UsersIcon class="w-6 h-6" />
      Cast
    </h2>
    <div class="movie-cast-grid">
      <div v-for="actor in cast" :key="actor.name" class="cast-member">
        <img
          v-if="actor.profile_path && profileUrl(actor.profile_path)"
          :src="profileUrl(actor.profile_path)!"
          :alt="actor.name"
          class="cast-member-photo"
          loading="lazy"
        />
        <div v-else class="cast-member-placeholder">
          <UserIcon class="w-8 h-8 text-gray-500" />
        </div>
        <p class="cast-member-name">{{ actor.name }}</p>
        <p class="cast-member-character">{{ actor.character }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { UsersIcon, UserIcon } from "lucide-vue-next";
import tmdbService from "@/services/tmdb";
import type { MovieDetails } from "@/types/movie";

interface Props {
  movie: MovieDetails;
  maxCast?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxCast: 10,
});

// Computed properties
const cast = computed(() => {
  if (!props.movie.credits?.cast) return [];
  return props.movie.credits.cast.slice(0, props.maxCast).map((actor) => ({
    name: actor.name,
    character: actor.character,
    profile_path: actor.profile_path,
  }));
});

const profileUrl = (path: string) => tmdbService.getProfileUrl(path, "w185");
</script>

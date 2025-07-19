<script setup lang="ts">
import { onMounted } from "vue";
import MoviesFilters from "@/components/MoviesFilters/MoviesFilters.vue";
import MovieGrid from "@/components/MovieGrid/MovieGrid.vue";
import AppHeader from "@/components/AppHeader/AppHeader.vue";
import { useMoviesStore } from "@/stores/movies";

const moviesStore = useMoviesStore();

onMounted(async () => {
  await moviesStore.initialize();
});
</script>

<template>
  <div class="page-container">
    <AppHeader />
    <main class="main-content">
      <MoviesFilters />
      <MovieGrid />
    </main>
  </div>
</template>

<style scoped></style>

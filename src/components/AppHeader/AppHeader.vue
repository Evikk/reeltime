<script setup lang="ts">
import { computed } from "vue";
import { FilmIcon } from "lucide-vue-next";
import ThemeToggle from "@/components/AppHeader/ThemeToggle.vue";
import { useMoviesStore } from "@/stores/movies";

const moviesStore = useMoviesStore();

const categories = [
  { key: "popular", label: "Popular" },
  { key: "top_rated", label: "Top Rated" },
  { key: "now_playing", label: "Now Playing" },
  { key: "upcoming", label: "Upcoming" },
  { key: "trending", label: "Trending" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

const currentCategory = computed({
  get: () => moviesStore.currentCategory,
  set: (value: CategoryKey) => {
    moviesStore.currentCategory = value;
  },
});

async function switchCategory(category: CategoryKey) {
  if (category !== currentCategory.value) {
    moviesStore.clearSearch();
    await moviesStore.fetchMoviesByCategory(category);
  }
}
</script>

<template>
  <header class="main-header">
    <div class="header-content">
      <div class="header-nav">
        <div class="logo-section">
          <FilmIcon class="w-8 h-8 text-blue-600 mr-3" />
          <h1 class="app-title">ReelTime</h1>
        </div>

        <div class="flex items-center space-x-4">
          <nav class="category-nav">
            <button
              v-for="category in categories"
              :key="category.key"
              @click="switchCategory(category.key)"
              :class="[
                'category-button',
                currentCategory === category.key
                  ? 'category-button--active'
                  : 'category-button--inactive',
              ]"
            >
              {{ category.label }}
            </button>
          </nav>

          <!-- Mobile category selector -->
          <div class="md:hidden">
            <select
              :value="currentCategory"
              @change="switchCategory(($event.target as HTMLSelectElement).value)"
              class="input-field"
            >
              <option v-for="category in categories" :key="category.key" :value="category.key">
                {{ category.label }}
              </option>
            </select>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped></style>

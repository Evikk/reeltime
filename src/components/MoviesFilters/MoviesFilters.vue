<template>
  <div class="filters-panel">
    <div class="search-container">
      <SearchIcon class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search movies by title..."
        class="search-input"
        @keydown.enter="onSearch"
        @input="onSearchInput"
      />
      <button v-if="searchQuery" @click="clearSearch" class="search-clear">
        <XIcon class="w-5 h-5" />
      </button>
    </div>

    <div class="filters-toggle">
      <button
        @click="showFilters = !showFilters"
        class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <FilterIcon class="w-5 h-5" />
        {{ showFilters ? "Hide Filters" : "Show Filters" }}
        <ChevronDownIcon
          :class="{ 'rotate-180': showFilters }"
          class="w-4 h-4 transition-transform duration-200"
        />
      </button>

      <div class="flex items-center gap-2">
        <button v-if="hasActiveFilters" @click="clearAllFilters" class="btn-secondary text-sm">
          Clear Filters
        </button>
      </div>
    </div>

    <div v-if="showFilters" class="filters-grid">
      <DropdownInput
        label="Genre"
        placeholder="All Genres"
        v-model="selectedGenre"
        :options="genreOptions"
      />

      <DropdownInput
        label="Release Year"
        placeholder="Any Year"
        v-model="selectedYear"
        :options="yearOptions"
      />

      <RangeInput label="Minimum Rating" v-model="minRating" :min="0" :max="10" :step="0.5" />

      <DropdownInput label="Sort By" v-model="sortBy" :options="sortOptions" />
    </div>

    <FilterTags
      :search-query="searchQuery"
      :selected-genre="selectedGenre"
      :selected-year="selectedYear"
      :min-rating="minRating"
      :genre-name="getGenreName(parseInt(selectedGenre))"
      @clear-search="clearSearch"
      @clear-genre="selectedGenre = ''"
      @clear-year="selectedYear = ''"
      @clear-rating="minRating = 0"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { SearchIcon, FilterIcon, XIcon, ChevronDownIcon } from "lucide-vue-next";
import { useMoviesStore } from "@/stores/movies";
import { useDebounceFn } from "@vueuse/core";
import FilterTags from "@/components/MoviesFilters/FilterTags.vue";
import DropdownInput from "@/components/MoviesFilters/DropdownInput.vue";
import RangeInput from "@/components/MoviesFilters/RangeInput.vue";
import type { SearchParams } from "@/types/movie";

const moviesStore = useMoviesStore();

const searchQuery = ref("");
const showFilters = ref(false);
const selectedGenre = ref("");
const selectedYear = ref("");
const minRating = ref(0);
const sortBy = ref<NonNullable<SearchParams["sort_by"]>>("popularity.desc");
const isLoading = ref(false);

const genres = computed(() => moviesStore.genres);

const genreOptions = computed(() =>
  genres.value.map((genre) => ({ value: genre.id.toString(), label: genre.name }))
);

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990;
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
});

const sortOptions = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "popularity.asc", label: "Least Popular" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "vote_average.asc", label: "Lowest Rated" },
];

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() ||
    selectedGenre.value ||
    selectedYear.value ||
    minRating.value > 0 ||
    sortBy.value !== "popularity.desc"
  );
});

function getGenreName(genreId: number): string {
  return moviesStore.getGenreName(genreId);
}

const debouncedSearch = useDebounceFn(async () => {
  if (searchQuery.value.trim()) {
    isLoading.value = true;
    await moviesStore.searchMovies(searchQuery.value.trim());
    isLoading.value = false;
  } else {
    moviesStore.clearSearch();
    await moviesStore.fetchMoviesByCategory("popular");
  }
}, 500);

function onSearchInput() {
  debouncedSearch();
}

function onSearch() {
  if (searchQuery.value.trim()) {
    moviesStore.searchMovies(searchQuery.value.trim());
  }
}

function clearSearch() {
  searchQuery.value = "";
  moviesStore.clearSearch();
  moviesStore.fetchMoviesByCategory("popular");
}

async function applyFilters() {
  isLoading.value = true;
  const filters = {
    sort_by: sortBy.value,
    with_genres: selectedGenre.value || undefined,
    primary_release_year: selectedYear.value ? parseInt(selectedYear.value) : undefined,
    vote_average_gte: minRating.value > 0 ? minRating.value : undefined,
  };

  moviesStore.updateFilters(filters);
  await moviesStore.discoverMovies(filters);
  isLoading.value = false;
}

function clearAllFilters() {
  searchQuery.value = "";
  selectedGenre.value = "";
  selectedYear.value = "";
  minRating.value = 0;
  sortBy.value = "popularity.desc";

  moviesStore.clearFilters();
  moviesStore.clearSearch();
  moviesStore.fetchMoviesByCategory("popular");
}

watch([selectedGenre, selectedYear, minRating, sortBy], () => {
  if (!searchQuery.value.trim()) {
    applyFilters();
  }
});

onMounted(() => {
  searchQuery.value = moviesStore.searchQuery;
});
</script>

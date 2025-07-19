<template>
  <div v-if="hasActiveFilters" class="active-filters">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>

    <FilterTag
      label="Search"
      :value="`&quot;${searchQuery}&quot;`"
      :show="!!searchQuery"
      @clear="$emit('clearSearch')"
    />

    <FilterTag
      label="Genre"
      :value="genreName"
      :show="!!selectedGenre"
      @clear="$emit('clearGenre')"
    />

    <FilterTag
      label="Year"
      :value="selectedYear"
      :show="!!selectedYear"
      @clear="$emit('clearYear')"
    />

    <FilterTag
      label="Rating"
      :value="`${minRating}+`"
      :show="minRating > 0"
      @clear="$emit('clearRating')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FilterTag from "./FilterTag.vue";

interface Props {
  searchQuery?: string;
  selectedGenre?: string;
  selectedYear?: string;
  minRating?: number;
  genreName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchQuery: "",
  selectedGenre: "",
  selectedYear: "",
  minRating: 0,
  genreName: "",
});

defineEmits<{
  clearSearch: [];
  clearGenre: [];
  clearYear: [];
  clearRating: [];
}>();

const hasActiveFilters = computed(() => {
  return (
    props.searchQuery?.trim() || props.selectedGenre || props.selectedYear || props.minRating > 0
  );
});
</script>

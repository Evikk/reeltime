<template>
  <div class="flex items-center justify-between">
    <div class="text-gray-600 dark:text-gray-400">
      <span class="font-medium">{{ totalResults.toLocaleString() }}</span>
      {{ isSearchMode ? "search results" : "movies" }}
      <span v-if="isSearchMode" class="text-blue-600 dark:text-blue-400">
        for "{{ searchQuery }}"
      </span>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="$emit('update:gridColumns', 'compact')"
        :class="[
          'btn-toggle',
          gridColumns === 'compact' ? 'btn-toggle--active' : 'btn-toggle--inactive',
        ]"
        title="Compact view"
      >
        <GridIcon class="w-4 h-4" />
      </button>
      <button
        @click="$emit('update:gridColumns', 'comfortable')"
        :class="[
          'btn-toggle',
          gridColumns === 'comfortable' ? 'btn-toggle--active' : 'btn-toggle--inactive',
        ]"
        title="Comfortable view"
      >
        <Grid2x2Icon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GridIcon, Grid2x2Icon } from "lucide-vue-next";

interface Props {
  totalResults: number;
  isSearchMode: boolean;
  searchQuery: string;
  gridColumns: "compact" | "comfortable";
}

defineProps<Props>();

defineEmits<{
  "update:gridColumns": [value: "compact" | "comfortable"];
}>();
</script>

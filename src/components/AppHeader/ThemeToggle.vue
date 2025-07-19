<template>
  <div class="theme-toggle">
    <button
      @click="toggleTheme"
      class="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :title="`Current theme: ${currentTheme}`"
    >
      <IconSun v-if="currentTheme === 'light'" class="text-gray-600 dark:text-gray-300" />
      <IconMoon v-else-if="currentTheme === 'dark'" class="text-gray-600 dark:text-gray-300" />
      <IconMonitor v-else class="text-gray-600 dark:text-gray-300" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";
import IconSun from "@/components/icons/IconSun.vue";
import IconMoon from "@/components/icons/IconMoon.vue";
import IconMonitor from "@/components/icons/IconMonitor.vue";

const themeStore = useThemeStore();

const currentTheme = computed(() => themeStore.currentTheme);

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<style scoped>
.theme-toggle {
  @apply select-none;
}
</style>

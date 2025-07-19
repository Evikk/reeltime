<template>
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <span v-if="message" class="loading-message">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

defineProps<Props>();
</script>

<style scoped>
.loading-container {
  @apply flex justify-center items-center gap-3;
}

.loading-message {
  @apply text-gray-600;
}
</style>

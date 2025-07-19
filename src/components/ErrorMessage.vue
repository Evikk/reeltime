<template>
  <div class="error-container">
    <div class="error-content">
      <h3 class="error-title">{{ title }}</h3>
      <p class="error-message">{{ message }}</p>
      <div v-if="showActions" class="error-actions">
        <button @click="$emit('retry')" class="btn-primary">Try Again</button>
        <button @click="$emit('goBack')" class="btn-secondary">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  message: string;
  showActions?: boolean;
}

interface Emits {
  retry: [];
  goBack: [];
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.error-container {
  @apply flex justify-center items-center min-h-screen;
}

.error-content {
  @apply bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto;
}

.error-title {
  @apply text-red-800 font-semibold mb-2;
}

.error-message {
  @apply text-red-600 mb-4;
}

.error-actions {
  @apply flex gap-2;
}
</style>

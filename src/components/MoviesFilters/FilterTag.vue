<template>
  <span v-if="show" class="filter-tag">
    {{ label }}: {{ value }}
    <button @click="$emit('clear')" class="ml-1 hover:text-blue-900">
      <XIcon class="w-3 h-3" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { XIcon } from "lucide-vue-next";

interface Props {
  label: string;
  value: string;
  show?: boolean;
}

withDefaults(defineProps<Props>(), {
  show: true,
});

defineEmits<{
  clear: [];
}>();
</script>

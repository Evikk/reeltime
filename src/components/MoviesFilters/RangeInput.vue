<template>
  <div class="filter-group">
    <label class="filter-label">
      {{ label }}
      <span v-if="modelValue !== undefined">: {{ modelValue }}</span>
    </label>

    <input
      :value="modelValue"
      @input="updateValue"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
    <div class="flex justify-between text-xs text-gray-500 mt-1">
      <span>{{ rangeLabels?.min || min }}</span>
      <span>{{ rangeLabels?.max || max }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RangeLabels {
  min?: string | number;
  max?: string | number;
}

interface Props {
  label: string;
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  rangeLabels?: RangeLabels;
}

interface Emits {
  (e: "update:modelValue", value: number): void;
}

withDefaults(defineProps<Props>(), {
  min: 0,
  max: 10,
  step: 0.5,
});

const emit = defineEmits<Emits>();

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  emit("update:modelValue", value);
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
}

input[type="range"]::-moz-range-track {
  background: #e2e8f0;
  height: 8px;
  border-radius: 4px;
  border: none;
}
</style>

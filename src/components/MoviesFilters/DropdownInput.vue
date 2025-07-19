<template>
  <div class="filter-group">
    <label class="filter-label">
      {{ label }}
    </label>

    <select :value="modelValue" @input="updateValue" class="input-field">
      <option value="">{{ placeholder || "All" }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface FilterOption {
  value: string | number;
  label: string;
}

interface Props {
  label: string;
  modelValue: string | number;
  placeholder?: string;
  options: FilterOption[];
}

interface Emits {
  (e: "update:modelValue", value: string | number): void;
}

withDefaults(defineProps<Props>(), {
  placeholder: "",
});

const emit = defineEmits<Emits>();

function updateValue(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
}
</script>

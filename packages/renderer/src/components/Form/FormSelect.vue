<template>
  <FormControl :label="label">
    <select
      :value="modelValue"
      class="windows:text-sm windows:border-gray-300 macos:text-system-text-control macos:bg-system-background-control macos:w-full macos:rounded macos:text-sm macos:py-1 macos:px-2"
      @change="modelValueUpdated"
    >
      <slot />
    </select>
  </FormControl>
</template>

<script lang="ts" setup>
import FormControl from './FormControl.vue';

defineProps<{
  label: string,
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

function modelValueUpdated(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value);
}
</script>

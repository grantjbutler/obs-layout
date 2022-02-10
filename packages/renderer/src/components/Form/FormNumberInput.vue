<template>
  <div class="flex flex-col space-y-2">
    <FormControl :label="label">
      <input
        type="number"
        :value="modelValue"
        class="text-right windows:w-24 windows:text-sm windows:border-gray-300 macos:text-system-text-control macos:bg-system-background-control macos:w-full macos:px-2 macos:py-1 macos:rounded"
        @input="modelValueUpdated"
      >
    </FormControl>
    <div v-if="showsSlider">
      <input
        type="range"
        :value="modelValue"
        class="w-full"
        @input="modelValueUpdated"
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import FormControl from './FormControl.vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  showsSlider: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>();

function modelValueUpdated(event: Event) {
  emit('update:modelValue', parseInt((event.target as HTMLInputElement).value, 10));
}
</script>

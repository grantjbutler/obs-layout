<template>
  <div class="flex flex-col space-y-2">
    <FormControl :label="label">
      <input
        type="number"
        :value="modelValue"
        class="text-right windows:w-24 windows:text-sm windows:border-gray-300 macos:text-system-text-control macos:bg-system-background-control macos:w-full macos:px-2 macos:py-1 macos:rounded"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </FormControl>
    <div v-if="showsSlider">
      <input
        type="range"
        :value="modelValue"
        class="w-full"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormControl from './FormControl.vue';
export default defineComponent({
  name: 'FormNumberInput',
  components: {
    FormControl,
  },
  props: {
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
  },
  emits: ['update:modelValue'],
});
</script>

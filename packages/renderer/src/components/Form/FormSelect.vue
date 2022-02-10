<template>
  <FormControl :label="label">
    <select
      :value="modelValue"
      class="windows:text-sm windows:border-gray-300 macos:text-system-text-control macos:bg-system-background-control macos:flex-grow macos:rounded macos:text-sm macos:py-1 macos:px-2"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <slot />
    </select>
  </FormControl>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormControl from './FormControl.vue';
export default defineComponent({
  name: 'FormSelect',
  components: {
    FormControl,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
});
</script>

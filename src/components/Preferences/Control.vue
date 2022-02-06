<template>
  <label class="macos:col-span-2 macos:col-start-2 macos:text-right">{{ label }}</label>
  <input class="macos:col-span-5 macos:col-end-9 macos:px-2 macos:py-1 macos:rounded macos:text-system-text-control macos:bg-system-background-control windows:mb-2 windows:w-2/3 windows:text-sm windows:border-gray-300" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" v-bind="$attrs">
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Control',
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      required: true
    }
  },
  emits: ['update:modelValue']
})
</script>

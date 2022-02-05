<template>
  <div class="flex flex-col space-y-2">
    <div class="flex items-baseline windows:justify-between">
      <label>{{ label }}</label>
      <input type="number" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="windows:text-sm windows:border-gray-300 w-24 text-right">
    </div>
    <div v-if="showsSlider">
      <input type="range" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="w-full">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FormNumberInput',
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Number,
      required: true
    },
    showsSlider: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
})
</script>

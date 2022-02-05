<template>
  <div class="flex items-baseline windows:justify-between">
    <label>{{ label }}</label>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" class="windows:text-sm windows:border-gray-300">
      <slot></slot>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FormSelect',
  props: {
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue']
})
</script>

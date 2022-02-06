<template>
  <div class="flex items-baseline windows:justify-between macos:px-2">
    <label class="macos:w-1/3 macos:text-right macos:mr-2 macos:flex-shrink-0">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true
    }
  }
})
</script>

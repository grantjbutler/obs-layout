<template>
  <fieldset>
    <legend class="macos:ml-2">{{ label }}</legend>
    
    <div class="p-2 space-y-2 macos:border macos:rounded macos:border-system-separator macos:bg-system-background-window">
      <div class="macos:grid macos:items-baseline macos:grid-cols-9 macos:gap-2">
        <slot></slot>
      </div>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Controls',
  props: {
    label: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <fieldset>
    <legend class="macos:ml-2 windows:text-2xl windows:mb-4">{{ label }}</legend>
    
    <div class="macos:p-2 macos:border macos:rounded macos:border-system-separator macos:bg-system-background-window">
      <div class="macos:grid macos:items-baseline macos:grid-cols-9 macos:gap-2 windows:flex windows:flex-col">
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

<template>
  <div class="flex-1 bg-gray-400">
    <div class="flex flex-col h-screen p-4 justify-center items-center">
      <div class="flex flex-row max-h-full w-full" style="aspect-ratio: 16 / 9">
        <div class="bg-red-600 shadow-lg w-full" style="aspect-ratio: 16 / 9"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Preview',
})
</script>

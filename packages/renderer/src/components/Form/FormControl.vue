<template>
  <div class="flex gap-2 items-first-baseline windows:justify-between macos:px-2">
    <label class="macos:w-1/3 macos:text-right macos:flex-shrink-0">{{ label }}</label>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
}>();
</script>

<template>
  <div class="windows:p-5">
    <h3 class="windows:text-lg windows:mb-4 macos:border-b macos:border-system-separator macos:p-2 macos:mb-4 macos:text-system-text-secondary macos:font-semibold">
      {{ title }}
    </h3>
    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <Dialog
    :open="open"
    class="fixed inset-x-0 bottom-0 z-10 flex flex-col bg-white"
    style="top: env(titlebar-area-height, 40px);"
    @close="$emit('close')"
  >
    <DialogTitle class="flex mb-4 space-x-2 text-4xl font-light">
      <button
        class="px-2 py-2 hover:bg-gray-200"
        title="Back"
        @click.prevent="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <span>Settings</span>
    </DialogTitle>

    <Content class="p-6 pt-4 overflow-y-auto" />
  </Dialog>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogTitle,
} from '@headlessui/vue';
import Content from './Content.vue';

defineProps<{
  open: boolean
}>();

defineEmits<{
  (e: 'close'): void
}>();
</script>

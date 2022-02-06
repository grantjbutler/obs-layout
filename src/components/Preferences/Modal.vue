<template>
  <Dialog :open="open" @close="close" class="fixed inset-x-0 bottom-0 z-10 bg-white flex flex-col" style="top: env(titlebar-area-height, 40px);">
    <DialogTitle class="text-4xl font-light flex space-x-2 mb-4">
      <button class="hover:bg-gray-200 px-2 py-2" title="Back" @click.prevent="close">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <span>Settings</span>
    </DialogTitle>

    <Content class="p-6 pt-4 overflow-y-auto"></Content>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  Dialog,
  DialogTitle,
} from "@headlessui/vue";
import Content from './Content.vue';

export default defineComponent({
  components: {
    Dialog,
    DialogTitle,

    Content
  },
  props: {
    open: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  setup(_, { emit }) {
    return {
      close: () => emit('close')
    };
  }
})
</script>

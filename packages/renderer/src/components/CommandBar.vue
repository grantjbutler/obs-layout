<template>
  <div>
    <div
      class="flex items-baseline p-2 space-x-2 app-region-drag bg-system-background-nav-bar"
      style="height: env(titlebar-area-height, 40px); width: env(titlebar-area-width, 0px);"
    >
      <ConnectionState size="small" />

      <span>obs-layout</span>
    </div>
    <div class="flex items-center justify-end bg-system-background-nav-bar">
      <Popover class="relative">
        <PopoverButton class="flex items-center p-3 space-x-1 hover:bg-gray-300">
          <CloudUploadIcon class="w-6 h-6 text-gray-600" />

          <span>Sync</span>
        </PopoverButton>

        <PopoverPanel class="absolute right-0 z-10">
          <sync-popover />
        </PopoverPanel>
      </Popover>

      <button
        class="flex p-3 space-x-1 hover:bg-gray-300"
        @click="$emit('openSettings')"
      >
        <CogIcon class="w-6 h-6 text-gray-600" />

        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CloudUploadIcon, CogIcon } from '@heroicons/vue/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import ConnectionState from './ConnectionState.vue';
import SyncPopover from './SyncPopover.vue';

defineEmits<{
  (e: 'openSettings'): void
}>();
</script>

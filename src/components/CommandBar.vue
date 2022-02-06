<template>
  <div>
    <div class="app-region-drag bg-system-background-nav-bar p-2 flex items-baseline space-x-2" style="height: env(titlebar-area-height, 40px); width: env(titlebar-area-width, 0px);">
      <ConnectionState size="small"></ConnectionState>
      
      <span>obs-layout</span>
    </div>
    <div class="bg-system-background-nav-bar flex items-center justify-end">
      <Popover class="relative">
        <PopoverButton class="flex items-center hover:bg-gray-300 p-3 space-x-1">
          <CloudUploadIcon class="w-6 h-6 text-gray-600" />

          <span>Sync</span>
        </PopoverButton>

        <PopoverPanel class="absolute z-10 right-0">
          <sync-popover></sync-popover>
        </PopoverPanel>
      </Popover>

      <button class="flex space-x-1 hover:bg-gray-300 p-3" @click="openSettings">
        <CogIcon class="w-6 h-6 text-gray-600" />

        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CloudUploadIcon, CogIcon } from '@heroicons/vue/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import ConnectionState from './ConnectionState.vue';
import SyncPopover from './SyncPopover.vue';

export default defineComponent({
  components: {
    CloudUploadIcon,
    CogIcon,
    ConnectionState,
    SyncPopover,

    Popover,
    PopoverButton,
    PopoverPanel
  },  
  setup(_, { emit }) {
    return {
      openSettings: () => emit('openSettings')
    }
  },
  emits: ['openSettings']
})
</script>

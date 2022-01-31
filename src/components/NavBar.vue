<template>
  <div class="flex flex-row h-10 app-region-drag">
    <div class="flex-none border-r w-72 border-system-divider"></div>
    <div class="flex items-center justify-between w-full px-3 border-b bg-system-background-nav-bar border-system-divider">
      <Popover class="relative">
        <div class="flex items-center">
          <PopoverButton class="flex items-center space-x-1">
            <CloudUploadIcon class="w-6 h-6" />

            <ChevronDownIcon class="w-3 h-3" />
          </PopoverButton>
        </div>

        <PopoverPanel class="absolute z-10">
          <sync-popover></sync-popover>
        </PopoverPanel>
      </Popover>
      <ConnectionState size="medium"></ConnectionState>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CloudUploadIcon, ChevronDownIcon } from '@heroicons/vue/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import ConnectionState from './ConnectionState.vue';
import SyncPopover from './SyncPopover.vue';

export default defineComponent({
  components: {
    CloudUploadIcon,
    ChevronDownIcon,

    Popover,
    PopoverButton,
    PopoverPanel,

    ConnectionState,
    SyncPopover
  },
})
</script>

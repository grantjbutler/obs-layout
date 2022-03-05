<template>
  <div>
    <div
      class="flex items-baseline p-2 space-x-2 app-region-drag bg-system-background-nav-bar"
      style="height: env(titlebar-area-height, 40px); width: env(titlebar-area-width, 0px);"
    >
      <ConnectionState size="small" />

      <span>obs-layout</span>
    </div>
    <div class="flex justify-between bg-system-background-nav-bar">
      <div class="flex items-center">
        <select
          v-model="selectedLayout"
          class="h-full bg-transparent border-0 hover:bg-gray-300"
        >
          <option
            v-for="layout in layouts"
            :key="layout.id"
            :value="layout.id"
          >
            {{ layout.name }}
          </option>
        </select>
        <button
          class="h-full p-3 hover:bg-gray-300"
          title="Add layout"
          @click="isNewLayoutModalOpen = true"
        >
          <PlusIcon class="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div class="flex items-center">
        <Popover class="relative">
          <PopoverButton
            class="flex items-center p-3 space-x-1 hover:bg-gray-300 disabled:opacity-25"
            :disabled="obsStore.connectionState != OBSConnectionState.Connected"
          >
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

    <new-layout-modal
      :open="isNewLayoutModalOpen"
      @close="setIsNewLayoutModalOpen"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { CloudUploadIcon, CogIcon, PlusIcon } from '@heroicons/vue/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import ConnectionState from './ConnectionState.vue';
import SyncPopover from './SyncPopover.vue';
import { useLayoutsStore } from '/@/store/layouts';
import NewLayoutModal from './Modals/NewLayoutModal.vue';
import { useObsStore } from '/@/store/obs';
import { OBSConnectionState } from '../../../shared/src/obs';

defineEmits<{
  (e: 'openSettings'): void
}>();

const obsStore = useObsStore();

const layoutsStore = useLayoutsStore();
const layouts = computed(() => layoutsStore.layouts);
const selectedLayout = computed({
  get: () => layoutsStore.selectedLayout.id,
  set: (value) => layoutsStore.selectLayout(value),
});

const isNewLayoutModalOpen = ref(false);
const setIsNewLayoutModalOpen = (value: boolean) => isNewLayoutModalOpen.value = value;
</script>

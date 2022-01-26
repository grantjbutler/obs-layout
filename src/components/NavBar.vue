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
          <div class="w-64 p-2 space-y-2 shadow-lg bg-system-background-window">
            <div>Sync current layout to scene:</div>
            
            <div>
              <select class="w-full text-system-text-control bg-system-background-control" v-model="scene">
                <option v-for="scene in scenes" :key="scene" :value="scene" v-text="scene"></option>
              </select>
            </div>

            <div class="flex justify-end">
              <button class="px-3 py-1 bg-green-500" @click="sync">Sync</button>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      <div class="w-4 h-4 rounded-full" :class="connectionStateBackgroundColor" :title="connectionStateText"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { OBSConnectionState } from '@/obs/connection-state'
import { useStore } from '@/store/app'
import { computed, defineComponent, ref } from 'vue'
import { CloudUploadIcon, ChevronDownIcon } from '@heroicons/vue/outline';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { syncLayout } from '@/integration/obs';

export default defineComponent({
  components: {
    CloudUploadIcon,
    ChevronDownIcon,

    Popover,
    PopoverButton,
    PopoverPanel
  },
  setup() {
    const store = useStore()

    // eslint-disable-next-line vue/return-in-computed-property
    const connectionStateBackgroundColor = computed(() => {
      switch (store.state.connectionState) {
        case OBSConnectionState.Connecting:
          return 'bg-yellow-500'
        case OBSConnectionState.Connected:
          return 'bg-green-500'
        case OBSConnectionState.Disconnected:
        case OBSConnectionState.Error:
          return 'bg-red-500'
      }
    })

    // eslint-disable-next-line vue/return-in-computed-property
    const connectionStateText = computed(() => {
      switch (store.state.connectionState) {
        case OBSConnectionState.Disconnected:
          return 'Disconnected'
        case OBSConnectionState.Connecting:
          return 'Connecting'
        case OBSConnectionState.Connected:
          return 'Connected'
        case OBSConnectionState.Error:
          return 'Error'
      }
    })

    const scene = ref('');
    const scenes = computed(() => store.state.scenes);

    const sync = () => {
      if (!store.state.rootNode) { return }
      syncLayout(store.state.rootNode, scene.value);
    }

    return {
      connectionStateBackgroundColor,
      connectionStateText,
      scenes,
      scene,
      sync
    }
  },
})
</script>

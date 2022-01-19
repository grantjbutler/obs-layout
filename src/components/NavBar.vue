<template>
  <div class="flex flex-row h-10 app-region-drag">
    <div class="flex-none border-r w-72 border-system-divider"></div>
    <div class="flex items-center justify-end w-full px-3 border-b bg-system-background-nav-bar border-system-divider">
      <div class="w-4 h-4 rounded-full" :class="connectionStateBackgroundColor" :title="connectionStateText"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { OBSConnectionState } from '@/obs/connection-state'
import { useStore } from '@/store/app'
import { computed, defineComponent } from 'vue'

export default defineComponent({
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

    return {
      connectionStateBackgroundColor,
      connectionStateText
    }
  },
})
</script>

<template>
  <div class="text-sm macos:bg-system-background-under-page macos:text-system-text macos:p-2">
    <div class="flex flex-col macos:gap-2 windows:gap-8 windows:w-1/2">
      <Controls label="OBS Connection">
        <Control label="Host" type="text" v-model="connection.host"></Control>
        <Control label="Port" type="text" v-model="connection.port"></Control>
        <Control label="Password" type="password" v-model="connection.password"></Control>

        <div class="flex justify-end macos:col-start-2 macos:col-end-9 windows:w-2/3">
          <button v-if="isConnectButtonVisible" class="px-3 py-1 bg-green-500 rounded" @click="connect">Connect</button>
          <button v-if="isAbortButtonVisible" class="px-3 py-1 bg-yellow-500 rounded">Abort</button>
          <button v-if="isDisconnectButtonVisible" class="px-3 py-1 bg-red-500 rounded" @click="disconnect">Disconnect</button>
        </div>
      </Controls>

      <Controls label="Filters">
        <div v-if="isWindows" class="mb-2">Filters allow you to limit which scenes and sources show up.</div>
        <Control label="Source Filter" type="text" v-model="sourceFilter"></Control>
        <Control label="Scene Filter" type="text" v-model="sceneFilter"></Control>
      </Controls>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import debounce from 'lodash/debounce';
import { isOBSConnectionOptions } from '@/obs/connection';
import { useObsConnectionState } from '@/integration/obs';
import { OBSConnectionState } from '@/obs/connection-state';
import Controls from '@/components/Preferences/Controls.vue';
import Control from '@/components/Preferences/Control.vue';
import { useIsWindows } from '@/integration/platform';

export default defineComponent({
  components: {
    Controls,
    Control
  },
  setup() {
    const connectionState = useObsConnectionState();
    const connection = ref({
      host: 'localhost',
      port: 4444,
      password: null
    });
    const sourceFilter = ref('');
    const sceneFilter = ref('');

    const isConnectButtonVisible = computed(() => connectionState.value == OBSConnectionState.Disconnected || connectionState.value == OBSConnectionState.Error)
    const isAbortButtonVisible = computed(() => connectionState.value == OBSConnectionState.Connecting);
    const isDisconnectButtonVisible = computed(() => connectionState.value == OBSConnectionState.Connected);

    const connect = () => {
      if (isOBSConnectionOptions(connection.value)) {
        ipcRenderer.send('connect-to-obs', JSON.parse(JSON.stringify(connection.value)));
      }
    }

    const disconnect = () => {
      ipcRenderer.send('disconnect-from-obs');
    }

    onMounted(() => {
      ipcRenderer.invoke('load-obs-connection')
        .then(connection => {
          if (connection) {
            connection.value = connection
          }
        });
      
      ipcRenderer.invoke('load-source-filter')
        .then(filter => {
          sourceFilter.value = filter;
        })
      
      ipcRenderer.invoke('load-scene-filter')
        .then(filter => {
          sceneFilter.value = filter;
        });
    });

    watch(sourceFilter, debounce((newFilter: string) => {
      ipcRenderer.send('set-source-filter', newFilter);
    }));

    watch(sceneFilter, debounce((newFilter: string) => {
      ipcRenderer.send('set-scene-filter', newFilter);
    }));
    
    const isWindows = useIsWindows();

    return {
      connection,
      connectionState,
      connect,
      disconnect,

      isConnectButtonVisible,
      isAbortButtonVisible,
      isDisconnectButtonVisible,

      sourceFilter,
      sceneFilter,

      isWindows
    }
  }
})
</script>
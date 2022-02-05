<template>
  <div class="h-screen text-sm bg-system-background-window text-system-text">
    <p class="controls-heading">OBS Connection</p>
    <div class="control-field">
      <label>Host</label>
      <input type="text" v-model="connection.host">
    </div>
    <div class="control-field">
      <label>Port</label>
      <input type="number" v-model="connection.port">
    </div>
    <div class="control-field">
      <label>Password</label>
      <input type="password" v-model="connection.password">
    </div>
    <div class="justify-end control-field">
      <button v-if="isConnectButtonVisible" class="px-3 py-1 bg-green-500 rounded" @click="connect">Connect</button>
      <button v-if="isAbortButtonVisible" class="px-3 py-1 bg-yellow-500 rounded">Abort</button>
      <button v-if="isDisconnectButtonVisible" class="px-3 py-1 bg-red-500 rounded" @click="disconnect">Disconnect</button>
    </div>
    <p class="controls-heading">Sources</p>
    <div class="control-field">
      <label>Source Filter</label>
      <input type="text" v-model="sourceFilter">
    </div>
    <div class="control-field">
      <label>Scene Filter</label>
      <input type="text" v-model="sceneFilter">
    </div>
  </div>
</template>

<script lang="ts">
import '@/assets/shared.css';
import { ipcRenderer } from 'electron';
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import debounce from 'lodash/debounce';
import { isOBSConnectionOptions } from './obs/connection';
import { useObsConnectionState } from './integration/obs';
import { OBSConnectionState } from './obs/connection-state';

export default defineComponent({
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
    
    return {
      connection,
      connectionState,
      connect,
      disconnect,

      isConnectButtonVisible,
      isAbortButtonVisible,
      isDisconnectButtonVisible,

      sourceFilter,
      sceneFilter
    }
  }
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
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
  </div>
</template>

<script lang="ts">
import '@/assets/shared.css';
import { ipcRenderer } from 'electron';
import { defineComponent } from 'vue'
import { isOBSConnectionOptions } from './obs/connection';

export default defineComponent({
  name: 'Preferences',
  data() {
    return {
      connection: {
        host: 'localhost',
        port: 4444,
        password: null
      }
    }
  },
  mounted() {
    ipcRenderer.invoke('load-obs-connection')
      .then(connection => {
        if (connection) {
          this.connection = connection
        }
      });
  },
  watch: {
    connection (newValue) {
      if (isOBSConnectionOptions(newValue)) {
        ipcRenderer.send('set-obs-connection', newValue);
      }
    }
  }
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
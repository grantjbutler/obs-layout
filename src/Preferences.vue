<template>
  <div class="h-screen bg-system-background-window text-system-text text-sm">
    <p class="controls-heading">OBS Connection</p>
    <div class="control-field">
      <label>Host</label>
      <input type="text">
    </div>
    <div class="control-field">
      <label>Port</label>
      <input type="number">
    </div>
    <div class="control-field">
      <label>Password</label>
      <input type="password">
    </div>
  </div>
</template>

<script lang="ts">
import '@/assets/shared.css';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Preferences',
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
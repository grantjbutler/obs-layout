<template>
  <div class="flex flex-row h-screen">
    <sidebar class="flex-none"></sidebar>
    <preview></preview>
    <controls class="flex-none"></controls>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Preview from './components/Preview.vue';
import Sidebar from './components/Sidebar.vue';
import Controls from './components/Controls.vue';

export default defineComponent({
  name: 'App',
  components: {
    Preview,
    Sidebar,
    Controls,
  }
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

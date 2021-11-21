<template>
  <div class="flex flex-row h-screen">
    <sidebar class="flex-none" :component="rootComponent"></sidebar>
    <preview :component="rootComponent"></preview>
    <controls class="flex-none"></controls>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Preview from './components/Preview.vue';
import Sidebar from './components/Sidebar.vue';
import Controls from './components/Controls.vue';
import Component from './layout/Component';

export default defineComponent({
  name: 'App',
  components: {
    Preview,
    Sidebar,
    Controls
  },
  setup() {
    const rootComponent = ref(new Component())

    return {
      rootComponent
    }
  }
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

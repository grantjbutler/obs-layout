<template>
  <div class="flex flex-col h-screen text-system-text text-sm">
    <nav-bar v-if="isMacOS" class="flex-none"></nav-bar>
    <command-bar v-if="isWindows" class="flex-none"></command-bar>
    <div class="flex-1 flex flex-row items-stretch">
      <sidebar class="flex-none border-r border-system-divider"></sidebar>
      <preview></preview>
      <controls class="flex-none border-l border-system-divider"></controls>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Preview from './components/Preview.vue';
import Sidebar from './components/Sidebar.vue';
import Controls from './components/Controls.vue';
import NavBar from './components/NavBar.vue';
import CommandBar from './components/CommandBar.vue';
import { useIsMacOS, useIsWindows } from './integration/platform';

export default defineComponent({
  name: 'App',
  components: {
    Preview,
    Sidebar,
    Controls,
    NavBar,
    CommandBar,
  },
  setup() {
    return {
      isMacOS: useIsMacOS(),
      isWindows: useIsWindows()
    }
  }
});
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

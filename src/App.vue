<template>
  <div class="flex flex-col h-screen text-sm text-system-text">
    <nav-bar v-if="isMacOS" class="flex-none"></nav-bar>
    <command-bar v-if="isWindows" class="flex-none" @open-settings="openSettings"></command-bar>
    <div class="flex flex-row items-stretch flex-1">
      <sidebar class="flex-none border-r border-system-divider"></sidebar>
      <preview></preview>
      <controls class="flex-none border-l border-system-divider"></controls>
    </div>
    <preferences-modal :open="isSettingsOpen" @close="closeSettings"></preferences-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Preview from './components/Preview.vue';
import Sidebar from './components/Sidebar.vue';
import Controls from './components/Controls.vue';
import NavBar from './components/NavBar.vue';
import CommandBar from './components/CommandBar.vue';
import PreferencesModal from './components/Preferences/Modal.vue';
import { useIsMacOS, useIsWindows } from './integration/platform';

export default defineComponent({
  name: 'App',
  components: {
    Preview,
    Sidebar,
    Controls,
    NavBar,
    CommandBar,
    PreferencesModal,
  },
  setup() {
    const isSettingsOpen = ref(false);

    return {
      isMacOS: useIsMacOS(),
      isWindows: useIsWindows(),

      isSettingsOpen,
      openSettings: () => isSettingsOpen.value = true,
      closeSettings: () => isSettingsOpen.value = false
    }
  }
});
</script>

<style>
@import url('./assets/shared.css');
</style>
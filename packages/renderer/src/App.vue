<template>
  <div class="flex flex-col h-screen text-sm text-system-text">
    <nav-bar
      v-if="isMacOS"
      class="flex-none"
    />
    <command-bar
      v-if="isWindows"
      class="flex-none"
      @open-settings="openSettings"
    />
    <div class="flex flex-row items-stretch flex-1">
      <layout-sidebar class="flex-none border-r border-system-divider" />
      <canvas-preview />
      <component-controls class="flex-none border-l border-system-divider" />
    </div>
    <preferences-modal
      v-if="isWindows"
      :open="isSettingsOpen"
      @close="closeSettings"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CanvasPreview from './components/CanvasPreview.vue';
import LayoutSidebar from './components/LayoutSidebar.vue';
import ComponentControls from './components/ComponentControls.vue';
import NavBar from './components/NavBar.vue';
import CommandBar from './components/CommandBar.vue';
import PreferencesModal from './components/Preferences/PreferencesModal.vue';
import { useIsMacOS, useIsWindows } from './integration/platform';

const isMacOS = useIsMacOS();
const isWindows = useIsWindows();

const isSettingsOpen = ref(false);

const openSettings = () => isSettingsOpen.value = true;
const closeSettings = () => isSettingsOpen.value = false;
</script>

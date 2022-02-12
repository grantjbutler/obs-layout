<template>
  <div class="w-64 p-2 space-y-2 shadow-lg bg-system-background-window">
    <div>Sync current layout to scene:</div>

    <div>
      <select
        v-model="scene"
        class="w-full text-system-text-control bg-system-background-control"
      >
        <option
          v-for="aScene in scenes"
          :key="aScene"
          :value="aScene"
          v-text="aScene"
        />
      </select>
    </div>

    <div class="flex justify-end">
      <button
        class="px-3 py-1 bg-green-500"
        @click="sync"
      >
        Sync
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useObsStore } from '/@/store/obs';
import { useLayoutStore } from '/@/store/layout';
import { syncLayout } from '/@/integration/obs';

const obsStore = useObsStore();
const layoutStore = useLayoutStore();
const scene = ref('');
const scenes = computed(() => obsStore.scenes);
const sync = () => {
  if (!layoutStore.rootNode) { return; }
  syncLayout(layoutStore.rootNode, scene.value);
};
</script>

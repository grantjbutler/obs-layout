<template>
  <div class="w-64 p-2 space-y-2 shadow-lg bg-system-background-window">
    <div>Sync current layout to scene:</div>

    <div>
      <select
        v-model="scene"
        class="w-full text-system-text-control bg-system-background-control"
      >
        <option
          v-for="scene in scenes"
          :key="scene"
          :value="scene"
          v-text="scene"
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

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from '/@/store/app';
import { syncLayout } from '/@/integration/obs';
export default defineComponent({
  setup() {
    const store = useStore();
    const scene = ref('');
    const scenes = computed(() => store.state.scenes);
    const sync = () => {
      if (!store.state.rootNode) { return; }
      syncLayout(store.state.rootNode, scene.value);
    };
    return {
      scene,
      scenes,
      sync,
    };
  },
});
</script>

<template>
  <div class="flex-1 bg-gray-400">
    <div class="flex flex-col h-screen p-4 justify-center items-center">
      <div class="flex flex-row max-h-full w-full" style="aspect-ratio: 16 / 9">
        <div class="bg-red-600 shadow-lg w-full relative" style="aspect-ratio: 16 / 9" v-if="component" v-observe-resize="canvasDidChangeSize" ref="canvas">
          <node-view v-if="node" :node="node"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { key } from '@/store'
import { SET_PREVIEW_SIZE } from '@/store/mutation-types'
import Size from '@/layout/Size'
import NodeView from './Preview/NodeView.vue';
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Preview',
  components: {
    NodeView
  },
  setup() {
    const store = useStore(key)
    const canvas = ref<HTMLElement | null>(null)
    
    const canvasDidChangeSize = (newSize: Size) => {
      store.commit(SET_PREVIEW_SIZE, newSize)
    }

    onMounted(() => {
      if (!canvas.value) {
        return;
      }

      const computedStyle = window.getComputedStyle(canvas.value);

      const width = parseInt(computedStyle.width, 10);
      const height = parseInt(computedStyle.height, 10);

      canvasDidChangeSize(new Size(width, height));
    });

    return {
      canvas,
      canvasDidChangeSize,
      node: computed(() => store.state.rootNode),
      component: computed(() => store.state.rootComponent)
    }
  }
})
</script>

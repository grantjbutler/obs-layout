<template>
  <div class="w-full h-full p-4 bg-gray-200 dark:bg-gray-800">
    <div class="relative w-full h-full overflow-hidden" v-observe-resize="didChangeSize">
      <canvas ref="canvas" class='absolute bg-white dark:bg-black' width="1920" height="1080"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/app'
import { computed, defineComponent, ref, watch } from 'vue'
import { LayoutNode } from '@/layout'
import { Size } from '@/layout'
import { usePreferredDark } from '@vueuse/core'

export default defineComponent({
  name: 'Preview',
  setup() {
    const store = useStore()
    const scale = ref(1);
    const canvas = ref<HTMLCanvasElement | null>(null);

    const didChangeSize = (newSize: Size) => {
      let el = canvas.value
      if (!el) { return; }

      el.style.transformOrigin = '0 0';

      let aspectRatio = 16 / 9;
      let width = Math.min(newSize.width, newSize.height * aspectRatio);
      let height = Math.min(newSize.height, newSize.width / aspectRatio);

      if (newSize.width > newSize.height) {
        scale.value = width / 1920
        el.style.transform = `scale(${scale.value}, ${scale.value})`
        el.style.left = ((newSize.width - width) / 2) + 'px';
        el.style.top = ((newSize.height - (width / aspectRatio)) / 2) + 'px';
      } else {
        scale.value = height / 1080
        el.style.transform = `scale(${scale.value}, ${scale.value})`
        el.style.left = ((newSize.width - (height * aspectRatio)) / 2) + 'px';
        el.style.top = ((newSize.height - height) / 2) + 'px';
      }
    }

    const node = computed(() => store.state.rootNode)
    const prefersDarkMode = usePreferredDark();

    const renderNode = (node: LayoutNode, context: CanvasRenderingContext2D) => {
      context.save();
      
      context.lineWidth = 1 / scale.value;

      if (node.isContainer) {
        context.strokeStyle = 'rgb(150, 150, 150)'
        context.setLineDash([4 / scale.value, 2 / scale.value]);
      } else {
        context.strokeStyle = prefersDarkMode.value ? 'white' : 'black';
        context.setLineDash([]);
      }

      context.strokeRect(node.frame.x, node.frame.y, node.frame.width, node.frame.height);
      context.translate(node.frame.x, node.frame.y);

      node.children.forEach(node => renderNode(node, context));

      context.restore();
    }

    const render = () => {
      const rootNode = node.value;
      if (!rootNode) { return; }
      const context = canvas.value?.getContext('2d')
      if (!context) { return }
      context.clearRect(0, 0, 1920, 1080);

      renderNode(rootNode, context);
    }

    watch(node, () => {
      render();
    })

    watch(canvas, () => {
      render();
    })

    watch(scale, () => {
      render();
    })

    watch(prefersDarkMode, () => {
      render();
    });

    return {
      canvas,
      didChangeSize,
    }
  }
})
</script>

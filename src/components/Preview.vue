<template>
  <div class="bg-gray-400 overflow-hidden w-full relative" v-observe-resize="didChangeSize">
    <canvas ref="canvas" class='bg-yellow-100 absolute' width="1920" height="1080"></canvas>
  </div>
</template>

<script lang="ts">
import { key } from '@/store/app'
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { LayoutNode } from '@/layout'
import { Size } from '@/layout'

export default defineComponent({
  name: 'Preview',
  setup() {
    const store = useStore(key)
    const size = ref(new Size(1920, 1080));
    const canvas = ref<HTMLCanvasElement | null>(null);
    const didChangeSize = (newSize: Size) => {
      let el = canvas.value
      if (!el) { return; }

      el.style.transformOrigin = '0 0';

      let aspectRatio = 16 / 9;
      let width = Math.min(newSize.width, newSize.height * aspectRatio);
      let height = Math.min(newSize.height, newSize.width / aspectRatio);

      if (newSize.width > newSize.height) {
        el.style.transform = `scale(${width / 1920}, ${width / aspectRatio / 1080})`
        el.style.left = ((newSize.width - width) / 2) + 'px';
        el.style.top = ((newSize.height - (width / aspectRatio)) / 2) + 'px';
      } else {
        el.style.transform = `scale(${height * aspectRatio / 1920}, ${height / 1080})`
        el.style.left = ((newSize.width - (height * aspectRatio)) / 2) + 'px';
        el.style.top = ((newSize.height - height) / 2) + 'px';
      }
    }

    let node = computed(() => store.state.rootNode)

    const renderNode = (node: LayoutNode, context: CanvasRenderingContext2D) => {
      context.save();
      
      if (node.isContainer) {
        context.setLineDash([4, 2]);
      } else {
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

    return {
      canvas,
      didChangeSize,
      node,
      size
    }
  }
})
</script>

<template>
  <div class="w-full h-full p-4 bg-gray-200 dark:bg-gray-800">
    <div
      v-observe-resize="didChangeSize"
      class="relative w-full h-full overflow-hidden"
    >
      <canvas
        ref="canvas"
        class="absolute bg-white dark:bg-black"
        :width="canvasSize.width"
        :height="canvasSize.height"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '/@/store/layout';
import { computed, ref, watch } from 'vue';
import type { LayoutNode } from '/@/layout';
import { ContainerLayoutNode , Size } from '/@/layout';
import { usePreferredDark } from '@vueuse/core';
import { useObsStore } from '../store/obs';

const store = useLayoutStore();
const obsStore = useObsStore();
const scale = ref(1);
const canvas = ref<HTMLCanvasElement | null>(null);
const node = computed(() => store.rootNode);
const prefersDarkMode = usePreferredDark();

const canvasSize = computed(() => obsStore.canvasSize);
const previewSize = ref<Size>(new Size(1920, 1080));

const didChangeSize = (newSize: Size) => {
  previewSize.value = newSize;
  resizeCanvas();
};

watch(canvasSize, () => resizeCanvas());

const resizeCanvas = () => {
  let el = canvas.value;
  if (!el) { return; }
  el.style.transformOrigin = '0 0';
  let aspectRatio = canvasSize.value.width / canvasSize.value.height;
  let width = Math.min(previewSize.value.width, previewSize.value.height * aspectRatio);
  let height = Math.min(previewSize.value.height, previewSize.value.width / aspectRatio);
  if (previewSize.value.width > previewSize.value.height) {
    scale.value = width / canvasSize.value.width;
    el.style.transform = `scale(${scale.value}, ${scale.value})`;
    el.style.left = ((previewSize.value.width - width) / 2) + 'px';
    el.style.top = ((previewSize.value.height - (width / aspectRatio)) / 2) + 'px';
  } else {
    scale.value = height / canvasSize.value.height;
    el.style.transform = `scale(${scale.value}, ${scale.value})`;
    el.style.left = ((previewSize.value.width - (height * aspectRatio)) / 2) + 'px';
    el.style.top = ((previewSize.value.height - height) / 2) + 'px';
  }
};

const renderNode = (node: LayoutNode, context: CanvasRenderingContext2D) => {
  context.save();

  context.lineWidth = 1 / scale.value;
  if (node instanceof ContainerLayoutNode) {
    context.strokeStyle = 'rgb(150, 150, 150)';
    context.setLineDash([4 / scale.value, 2 / scale.value]);
  } else {
    context.strokeStyle = prefersDarkMode.value ? 'white' : 'black';
    context.setLineDash([]);
  }
  context.strokeRect(node.frame.x, node.frame.y, node.frame.width, node.frame.height);
  context.translate(node.frame.x, node.frame.y);
  if (node instanceof ContainerLayoutNode) {
    node.children.forEach(node => renderNode(node, context));
  }
  context.restore();
};

const render = () => {
  const rootNode = node.value;
  if (!rootNode) { return; }
  const context = canvas.value?.getContext('2d');
  if (!context) { return; }
  context.clearRect(0, 0, canvasSize.value.width, canvasSize.value.height);
  renderNode(rootNode, context);
};

watch([node, canvas, scale, prefersDarkMode, canvasSize], () => render());
</script>

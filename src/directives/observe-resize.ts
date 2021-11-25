import Size from '@/layout/Size';
import { Directive } from 'vue';

const RESIZE_OBSERVER = Symbol()

const directive: Directive<any, (size: Size) => void> = {
  mounted(el, binding) {
    if (el[RESIZE_OBSERVER]) {
      return;
    }

    el[RESIZE_OBSERVER] = new ResizeObserver(entries => {
      for (const entry of entries) {
        let size: Size
        if (entry.contentBoxSize && entry.contentBoxSize.length > 0) {
          const width = entry.contentBoxSize[0].inlineSize
          const height = entry.contentBoxSize[0].blockSize
          size = new Size(width, height)
        } else {
          const width = entry.contentRect.width
          const height = entry.contentRect.height
          size = new Size(width, height)
        }

        binding.value(size)
      }
    })
    el[RESIZE_OBSERVER].observe(el)
  },
  beforeUnmount(el) {
    if (!el[RESIZE_OBSERVER]) {
      return;
    }

    el[RESIZE_OBSERVER].unobserve(el);
    el[RESIZE_OBSERVER] = null;
  }
}

export default directive;
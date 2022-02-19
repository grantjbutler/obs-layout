import type { Directive } from 'vue';

const directive: Directive = {
  mounted(el) {
    el.focus();
  },
};

export default directive;

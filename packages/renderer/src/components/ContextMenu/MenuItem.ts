import { defineComponent, Text, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { MenuItemDefinition } from '../../../../shared/src/menus';

export default defineComponent({
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['click'],
  setup(props, context) {
    const label = ref('');
    const id = ref(uuidv4());

    const buildItem = (): MenuItemDefinition => {
      return {
        id: id.value,
        label: label.value,
        enabled: props.enabled,
      };
    };

    context.expose({
      buildItem,
    });

    window.contextMenu.onClick(id.value, () => context.emit('click'));

    return () => {
      if (!context.slots.default) {
        throw new Error();
      }

      const children = context.slots.default();
      const [firstChild, ...others] = children;

      if (others.length > 0) {
        throw new Error();
      }

      if (firstChild.type != Text) {
        throw new Error();
      }

      label.value = (firstChild.children as string).trim();

      return null;
    };
  },
});

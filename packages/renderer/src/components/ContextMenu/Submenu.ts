import { defineComponent } from '@vue/runtime-core';
import useMenuBuilding from './useMenuBuilding';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const { buildItem, buildMenu } = useMenuBuilding();
    const buildSubmenuItem = () => {
      return {
        'label': props.label,
        'submenu': buildItem(),
        'enabled': props.enabled,
      };
    };

    context.expose({
      buildItem: buildSubmenuItem,
    });

    return () => {
      const children = context.slots.default?.();
      buildMenu(children ?? []);
      return children;
    };
  },
});

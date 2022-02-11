import { defineComponent } from '@vue/runtime-core';
import useMenuBuilding from './useMenuBuilding';

export default defineComponent({
  name: 'Submenu',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const { buildItem, buildMenu } = useMenuBuilding();
    const buildSubmenuItem = () => {
      return {
        'label': props.label,
        'submenu': buildItem(),
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

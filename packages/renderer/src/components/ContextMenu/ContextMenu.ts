import { defineComponent } from 'vue';
import useMenuBuilding from './useMenuBuilding';

export default defineComponent({
  name: 'ContextMenu',
  setup(_, context) {
    const { buildItem, buildMenu } = useMenuBuilding();

    context.expose({
      buildItem,
    });

    return () => {
      const children = context.slots.default?.();
      buildMenu(children ?? []);
      return children;
    };
  },
});

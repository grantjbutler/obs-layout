import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'ContextMenuProviding',
  setup(props, context) {
    return () => {
      const defaultSlot = context.slots.default?.() ?? [];
      const menuSlot = context.slots.menu?.() ?? [];

      return h(
        'div',
        {
          onContextmenu: (event: Event) => {
            event.preventDefault();

            const [node] = menuSlot;
            if (!node) {
              return;
            }

            const component = node.component;
            if (!component) {
              return;
            }

            event.stopPropagation();

            const buildItem = component.exposed?.buildItem;
            if (!buildItem) {
              throw new Error();
            }

            const menu = buildItem();
            window.contextMenu.show(menu);
          },
        },
        [...defaultSlot, ...menuSlot],
      );
    };
  },
});

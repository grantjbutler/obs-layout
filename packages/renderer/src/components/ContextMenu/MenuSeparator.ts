import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuSeparator',
  setup(_, context) {
    const buildItem = () => {
      return {
        'type': 'separator',
      };
    };

    context.expose({
      buildItem,
    });

    return () => {
      return null;
    };
  },
});

import { defineComponent, Text, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { ipcRenderer } from 'electron';
import MenuItemDefinition from './MenuItemDefinition'

export default defineComponent({
  emits: ['click'],
  setup(props, context) {
    const label = ref('');
    const id = ref(uuidv4())

    const buildItem = (): MenuItemDefinition => {
      return {
        id: id.value,
        label: label.value
      }
    }

    context.expose({
      buildItem
    })

    ipcRenderer.on(`context-menu:click:${id.value}`, () => {
      context.emit('click');
    })

    return () => {
      if (!context.slots.default) {
        throw new Error();
      }
      
      const children = context.slots.default()
      const [firstChild, ...others] = children

      if (others.length > 0) {
        throw new Error();
      }

      if (firstChild.type != Text) {
        throw new Error();
      }

      label.value = firstChild.children as string

      return null
    }
  }
})

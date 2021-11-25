import { ipcRenderer } from 'electron'
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup(props, context) {
    return () => {
      const defaultSlot = context.slots.default?.() ?? []
      const menuSlot = context.slots.menu?.() ?? []
      
      return h(
        'div',
        {
          onContextmenu: (event: Event) => {
            event.preventDefault()

            const [node] = menuSlot
            if (!node) {
              return;
            }
            
            const component = node.component
            if (!component) {
              return;
            }

            event.stopPropagation()

            const buildItem = component.exposed?.buildItem
            if (!buildItem) {
              throw new Error();
            }

            const menu = buildItem();
            ipcRenderer.send('show-context-menu', JSON.parse(JSON.stringify(menu)));
          }
        },
        [...defaultSlot, ...menuSlot]
      )
    }    
  },
})

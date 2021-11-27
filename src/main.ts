import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import observeResize from './directives/observe-resize'
import {
  ContextMenu, ContextMenuProviding, MenuItem, MenuSeparator, Submenu
} from './components/ContextMenu';

createApp(App)
  .use(store, key)
  .directive(
    'observe-resize', observeResize
  )
  .component('context-menu', ContextMenu)
  .component('context-menu-providing', ContextMenuProviding)
  .component('menu-item', MenuItem)
  .component('menu-separator', MenuSeparator)
  .component('Submenu', Submenu)
  .mount('#app')

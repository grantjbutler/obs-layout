import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '/@/App.vue';
import observeResize from '/@/directives/observe-resize';
import {
  ContextMenu, ContextMenuProviding, MenuItem, MenuSeparator, Submenu,
} from '/@/components/ContextMenu';
import './../assets/style.css';
import { useObs } from './integration/obs';

createApp(App)
  .use(createPinia())
  .directive(
    'observe-resize', observeResize,
  )
  .component('context-menu', ContextMenu)
  .component('context-menu-providing', ContextMenuProviding)
  .component('menu-item', MenuItem)
  .component('menu-separator', MenuSeparator)
  .component('Submenu', Submenu)
  .mount('#app');

useObs();

document.getElementsByTagName('html')[0]
  .classList.add(window.platform);

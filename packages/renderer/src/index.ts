import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueClickAway from 'vue3-click-away';
import App from '/@/App.vue';
import observeResize from '/@/directives/observe-resize';
import focus from '/@/directives/focus';
import {
  ContextMenu, ContextMenuProviding, MenuItem, MenuSeparator, Submenu,
} from '/@/components/ContextMenu';
import './../assets/style.css';
import { useObs } from './integration/obs';
import Preferences from './Preferences.vue';

let page = App;
switch (window.page) {
  case 'preferences':
    page = Preferences;
    break;
  case 'app':
  default:
    break;
}

createApp(page)
  .use(VueClickAway)
  .use(createPinia())
  .directive('observe-resize', observeResize)
  .directive('focus', focus)
  .component('context-menu', ContextMenu)
  .component('context-menu-providing', ContextMenuProviding)
  .component('menu-item', MenuItem)
  .component('menu-separator', MenuSeparator)
  .component('Submenu', Submenu)
  .mount('#app');

useObs();

document.getElementsByTagName('html')[0]
  .classList.add(window.platform);

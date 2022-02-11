import { createApp } from 'vue';
import Preferences from '/@/Preferences.vue';
import {
  ContextMenu, ContextMenuProviding, MenuItem, MenuSeparator, Submenu,
} from '/@/components/ContextMenu';
import './../assets/style.css';

createApp(Preferences)
  .component('context-menu', ContextMenu)
  .component('context-menu-providing', ContextMenuProviding)
  .component('menu-item', MenuItem)
  .component('menu-separator', MenuSeparator)
  .component('Submenu', Submenu)
  .mount('#app');

document.getElementsByTagName('html')[0]
  .classList.add(window.platform);

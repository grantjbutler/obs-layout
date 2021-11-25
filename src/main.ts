import { createApp } from 'vue'
import App from './App.vue'
import { store, key } from './store'
import observeResize from './directives/observe-resize'

createApp(App)
  .use(store, key)
  .directive(
    'observe-resize', observeResize
  )
  .mount('#app')

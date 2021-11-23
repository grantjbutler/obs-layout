import { defineComponent } from "vue";

export default defineComponent({
  setup(props, context) {
    const buildItem = () => {
      return {
        'type': 'separator'
      }
    }
    
    context.expose({
      buildItem
    })

    return () => {
      return null
    }
  }
})
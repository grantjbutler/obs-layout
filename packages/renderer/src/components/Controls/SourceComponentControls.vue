<template>
  <Controls title="Source Component">
    <FormSelect
      v-model="source"
      label="Source"
    >
      <option
        v-for="aSource in sources"
        :key="aSource"
        :value="aSource"
        v-text="aSource.name"
      />
    </FormSelect>
  </Controls>
</template>

<script lang="ts">
import type SourceComponent from '/@/layout/SourceComponent';
import { useStore } from '/@/store/app';
import { SOURCE_SET_SOURCE } from '/@/store/mutation-types';
import type { PropType} from 'vue';
import { computed, defineComponent, toRefs } from 'vue';
import FormSelect from '/@/components/Form/FormSelect.vue';
import Controls from './Controls.vue';
export default defineComponent({
  name: 'SourceComponentControls',
  components: {
    FormSelect,
    Controls,
  },
  props: {
    component: {
      type: Object as PropType<SourceComponent>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const { component } = toRefs(props);
    const sources = computed(() => store.state.sources);
    return {
      source: computed({
        get(): string { return component.value.source; },
        set(value) { store.commit(SOURCE_SET_SOURCE, value); },
      }),
      sources,
    };
  },
});
</script>

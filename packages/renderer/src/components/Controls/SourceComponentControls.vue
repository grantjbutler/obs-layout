<template>
  <Controls title="Source Component">
    <FormSelect
      v-model="source"
      label="Source"
    >
      <option
        v-for="aSource in sources"
        :key="aSource.name"
        :value="aSource"
        v-text="aSource.name"
      />
    </FormSelect>
  </Controls>
</template>

<script lang="ts" setup>
import type SourceComponent from '/@/layout/SourceComponent';
import { useStore } from '/@/store/app';
import { SOURCE_SET_SOURCE } from '/@/store/mutation-types';
import { computed } from 'vue';
import type { Source } from '../../../../shared/src/obs';
import FormSelect from '/@/components/Form/FormSelect.vue';
import Controls from './Controls.vue';

const props = defineProps<{
  component: SourceComponent
}>();

const store = useStore();
const sources = computed(() => store.state.sources);

const source = computed({
  get(): Source | undefined { return props.component.source; },
  set(value?: Source) { store.commit(SOURCE_SET_SOURCE, value); },
});
</script>

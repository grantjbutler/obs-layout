<template>
  <Controls title="Source Component">
    <FormSelect
      v-model="source"
      label="Source"
    >
      <option
        v-for="aSource in sources"
        :key="aSource.name"
        :value="aSource.name"
        v-text="aSource.name"
      />
    </FormSelect>
  </Controls>
</template>

<script lang="ts" setup>
import type SourceComponent from '/@/layout/SourceComponent';
import { setSource } from '/@/store/components/source';
import { useObsStore } from '/@/store/obs';
import { computed } from 'vue';
import FormSelect from '/@/components/Form/FormSelect.vue';
import Controls from './Controls.vue';

const props = defineProps<{
  component: SourceComponent
}>();

const obsStore = useObsStore();
const sources = computed(() => obsStore.sources);

const source = computed({
  get(): string { return props.component.source?.name ?? ''; },
  set(value: string) {
    const source = sources.value.find(source => source.name == value);
    if (!source) { return; }
    setSource(source);
  },
});
</script>

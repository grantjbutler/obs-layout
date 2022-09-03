<template>
  <ControlsGroup title="Source Component">
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
    <FormSelect
      v-model="scalingMode"
      label="Scaling Mode"
    >
      <option value="aspect-fit">
        Aspect Fit
      </option>
      <option value="aspect-fill">
        Aspect Fill
      </option>
      <option value="none">
        Don't Scale
      </option>
    </FormSelect>
  </ControlsGroup>
</template>

<script lang="ts" setup>
import type SourceComponent from '/@/layout/SourceComponent';
import { setScalingMode, setSource } from '/@/store/components/source';
import { useObsStore } from '/@/store/obs';
import { computed } from 'vue';
import FormSelect from '/@/components/Form/FormSelect.vue';
import ControlsGroup from './ControlsGroup.vue';

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

const scalingMode = computed({
  get(): 'aspect-fit' | 'aspect-fill' | 'none' { return props.component.scalingMode; },
  set(scalingMode: 'aspect-fit' | 'aspect-fill' | 'none') { setScalingMode(scalingMode); },
});
</script>

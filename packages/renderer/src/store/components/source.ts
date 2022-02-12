import { useLayoutStore } from '/@/store/layout';
import { SourceComponent } from '/@/layout';
import type { Source } from '../../../../shared/src/obs';

export const setSource = (source?: Source) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof SourceComponent)) {
    return;
  }
  store.selectedComponent.source = source;

  store.exerciseLayout();
};

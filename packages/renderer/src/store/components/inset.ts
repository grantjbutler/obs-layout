import { useLayoutStore } from '/@/store/layout';
import type { Insets } from '/@/layout';
import { InsetComponent } from '/@/layout';

export const setInsets = (insets: Insets) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof InsetComponent)) {
    return;
  }
  store.selectedComponent.insets = insets;

  store.exerciseLayout();
};

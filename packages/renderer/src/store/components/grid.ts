import { useLayoutStore } from '/@/store/layout';
import { GridComponent } from '/@/layout';

export const setDistribution = (distribution: 'leading' | 'center' | 'trailing' | 'justify-between') => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof GridComponent)) {
    return;
  }
  store.selectedComponent.distribution = distribution;

  store.exerciseLayout();
};

export const setColumnSpacing = (spacing: number) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof GridComponent)) {
    return;
  }
  store.selectedComponent.columnSpacing = spacing;

  store.exerciseLayout();
};

export const setRowSpacing = (spacing: number) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof GridComponent)) {
    return;
  }
  store.selectedComponent.rowSpacing = spacing;

  store.exerciseLayout();
};

export const setColumnCount = (count: number) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof GridComponent)) {
    return;
  }
  store.selectedComponent.columnCount = count;

  store.exerciseLayout();
};

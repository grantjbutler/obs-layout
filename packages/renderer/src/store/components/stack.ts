import { useLayoutStore } from '/@/store/layout';
import { StackComponent } from '/@/layout';

export const setHorizontalAlignment = (horizontalAlignment: 'leading' | 'center' | 'trailing') => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof StackComponent)) {
    return;
  }
  store.selectedComponent.horizontalAlignment = horizontalAlignment;

  store.exerciseLayout();
};

export const setVerticalAlignment = (verticalAlignment: 'leading' | 'center' | 'trailing') => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof StackComponent)) {
    return;
  }
  store.selectedComponent.verticalAlignment = verticalAlignment;

  store.exerciseLayout();
};

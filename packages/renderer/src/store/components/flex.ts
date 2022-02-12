import { useLayoutStore } from '/@/store/layout';
import { FlexComponent } from '/@/layout';

export const setDirection = (direction: 'horizontal' | 'vertical') => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof FlexComponent)) {
    return;
  }
  store.selectedComponent.direction = direction;

  store.exerciseLayout();
};

export const setDistribution = (distribution: 'leading' | 'center' | 'trailing') => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof FlexComponent)) {
    return;
  }
  store.selectedComponent.distribution = distribution;

  store.exerciseLayout();
};

export const setSpacing = (spacing: number) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof FlexComponent)) {
    return;
  }
  store.selectedComponent.spacing = spacing;

  store.exerciseLayout();
};

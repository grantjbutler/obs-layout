import { useLayoutStore } from '/@/store/layout';
import { SourceComponent } from '/@/layout';
import type { Source } from '../../../../shared/src/obs';

export const setSource = (source?: Source) => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof SourceComponent)) {
    return;
  }
  const sourceComponent = store.selectedComponent;
  store.selectedComponent.source = source;

  store.exerciseLayout();

  if (source) {
    window.obs.screenshotSource(source.name)
      .then(image => {
        const currentSource = sourceComponent.source;
        if (!currentSource) {
          return;
        }
        else if (currentSource.name == source.name) {
          sourceComponent.screenshot = image;
          store.exerciseLayout();
        }
      });
  }
};

export const setScalingMode = (scalingMode: 'aspect-fit' | 'aspect-fill' | 'none') => {
  const store = useLayoutStore();
  if (!store.selectedComponent || !(store.selectedComponent instanceof SourceComponent)) {
    return;
  }

  store.selectedComponent.scalingMode = scalingMode;

  store.exerciseLayout();
};


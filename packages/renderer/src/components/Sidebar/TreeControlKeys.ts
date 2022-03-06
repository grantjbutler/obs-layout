import type { InjectionKey, Ref } from 'vue';
import type { Component } from '/@/layout';

export const draggedComponentKey = Symbol() as InjectionKey<Ref<Component | null>>;

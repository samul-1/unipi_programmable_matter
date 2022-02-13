import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    [x: string]: any;
    gridWidth: any;
    count: number;
    logs: unknown[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

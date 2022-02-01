import { createApp } from 'vue';
import App from './App.vue';
import Vue from 'vue';
import VueKonva from 'vue-konva';
import store from './store';

createApp(App).use(VueKonva).use(store).mount('#app');

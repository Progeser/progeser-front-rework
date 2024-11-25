/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import {createPinia} from "pinia";
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

const app = createApp(App);

registerPlugins(app)

const pinia = createPinia();

pinia.use(piniaPluginPersistedState);
app.use(pinia);

app.mount('#app');

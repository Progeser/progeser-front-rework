// Plugins
import vuetify from './vuetify'
import router from '../router'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Types
import type { App } from 'vue'
import {createPinia} from "pinia";
import i18n from "@/plugins/i18n";

const pinia = createPinia()

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(i18n)
    .use(pinia)
    .use(VueAxios, axios)
}

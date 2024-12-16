import {createRouter, createWebHistory} from 'vue-router/auto'
import menuRoutes from './menuRoutes'
import routes from "@/router/routes";
import {useAuthStore} from "@/store/AuthStore";

const allRoutes = [...menuRoutes, ...routes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const isAuthenticated = authStore.isAuthenticated()

  if (isAuthenticated) {
    next();
  } else if (to.name === 'Login' || to.name === 'Request') {
    next();
  } else {
    next({name: 'Login'});
  }
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router

import { createRouter, createWebHistory } from 'vue-router/auto'
import menuRoutes from './menuRoutes'
import routes from "@/router/routes";
import {useUserStore} from "@/store/UserStore";
import {useAuthStore} from "@/store/AuthStore";

const allRoutes = [...menuRoutes, ...routes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  const isAuthenticated = authStore.isAuthenticated()
  const user = userStore.currentUser

  if (isAuthenticated) {
    if (to.meta.role === 'any' || to.meta.role === user!.role) {
      next();
    } else {
      next({name: 'Login'});
    }
  } else if (to.name === 'Login') {
    next();
  } else {
    next({name: 'Login'});
  }
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
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

import {RouteRecordRaw} from "vue-router";

const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/homePage.vue'),
  },
  {
    path: '/buildings',
    name: 'buildings',
    component: () => import('@/pages/buildingPage.vue'),
  },
  {
    path: '/species',
    name: 'species',
    component: () => import('@/pages/speciesPage.vue'),
  },
  {
    path: '/containers',
    name: 'containers',
    component: () => import('@/pages/potPage.vue'),
  },
  {
    path: '/requests',
    name: 'requests',
    component: () => import('@/pages/requestPage.vue'),
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/userPage.vue'),
  },
];

export const icons: Record<string, string> = {
  home: 'mdi-home',
  buildings: 'mdi-city',
  species: 'mdi-flower',
  containers: 'mdi-pot',
  requests: 'mdi-bell',
  users: 'mdi-account',
};


export default menuRoutes;
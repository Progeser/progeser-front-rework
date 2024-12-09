import {RouteRecordRaw} from "vue-router";

const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/pages/homePage.vue'),
    meta: { role: 'any' }
  },
  {
    path: '/buildings',
    name: 'buildings',
    component: () => import('@/pages/building/buildingsPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/species',
    name: 'species',
    component: () => import('@/pages/species/speciesPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/containers',
    name: 'containers',
    component: () => import('@/pages/containers/containersPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/requests',
    name: 'requests',
    component: () => import('@/pages/request/requestPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/userPage.vue'),
    meta: { role: 'grower' }
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

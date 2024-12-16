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
    path: '/requests/new',
    name: 'requestsNew',
    component: () => import('@/pages/requests/requestsPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/requests/accepted',
    name: 'requestsAccepted',
    component: () => import('@/pages/requests/requestsPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/requests/archived',
    name: 'requestsArchived',
    component: () => import('@/pages/requests/requestsPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/requests/requestsPage.vue'),
    meta: { role: 'grower' }
  },
];

export const icons: Record<string, string> = {
  home: 'mdi-home',
  buildings: 'mdi-city',
  species: 'mdi-flower',
  containers: 'mdi-pot',
  requestsNew: 'mdi-bell',
  requestsAccepted: 'mdi-calendar-clock',
  requestsArchived: 'mdi-calendar-remove',
  users: 'mdi-account',
};


export default menuRoutes;

import {RouteRecordRaw} from "vue-router";

const menuRoutes: RouteRecordRaw[] = [
  {
    path: '/buildings',
    name: 'buildings',
    component: () => import('@/pages/building/buildingsPage.vue'),
  },
  {
    path: '/species',
    name: 'species',
    component: () => import('@/pages/species/speciesPage.vue'),
  },
  {
    path: '/containers',
    name: 'containers',
    component: () => import('@/pages/containers/containersPage.vue'),
  },
  {
    path: '/requests',
    name:"requests",
    children: [
      {
        path: '/new',
        name: 'requestsNew',
        component: () => import('@/pages/requests/requestsPage.vue'),
      },
      {
        path: '/accepted',
        name: 'requestsAccepted',
        component: () => import('@/pages/requests/requestsPage.vue'),
      },
      {
        path: '/archived',
        name: 'requestsArchived',
        component: () => import('@/pages/requests/requestsPage.vue'),
      }
    ]
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/pages/user/usersPage.vue'),
  },
];

export const icons: Record<string, string> = {
  home: 'mdi-home',
  buildings: 'mdi-city',
  species: 'mdi-flower',
  containers: 'mdi-pot',
  requests: 'mdi-bell',
  requestsNew: 'mdi-bell',
  requestsAccepted: 'mdi-calendar-clock',
  requestsArchived: 'mdi-calendar-remove',
  users: 'mdi-account',
};


export default menuRoutes;

// Définition des routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index.vue'),
    icon : 'mdi-home',
  },
  {
    path: '/batiments',
    name: 'Batiments',
    component: () => import('../pages/index.vue'),
    icon : 'mdi-home',
  },
  {
    path: '/plantes',
    name: 'Plantes',
    component: () => import('../pages/index.vue'),
  },
  {
    path: '/pots',
    name: 'Pots',
    component: () => import('../pages/index.vue'),
  },
  {
    path: '/demandes',
    name: 'Demandes',
    component: () => import('../pages/index.vue'),
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateurs',
    component: () => import('../pages/index.vue'),
  },
];

export default routes;

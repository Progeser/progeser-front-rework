
// Définition des routes

import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home.vue'),
  },
  {
    path: '/batiments',
    name: 'Batiments',
    component: () => import('@/pages/batiment.vue'),
  },
  {
    path: '/plantes',
    name: 'Plantes',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/pots',
    name: 'Pots',
    component: () => import('@/pages/pot.vue'),
  },
  {
    path: '/demandes',
    name: 'Demandes',
    component: () => import('@/pages/demande.vue'),
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateurs',
    component: () => import('@/pages/utilisateur.vue'),
  },
];

export const icons = {
  Home: 'mdi-home',
  Batiments: 'mdi-city',
  Plantes: 'mdi-flower',
  Pots: 'mdi-pot',
  Demandes: 'mdi-bell',
  Utilisateurs: 'mdi-account',
};


export default routes;

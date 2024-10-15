
// Définition des routes

import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Accueil',
    component: () => import('@/pages/accueilPage.vue'),
  },
  {
    path: '/batiments',
    name: 'Batiments',
    component: () => import('@/pages/batimentPage.vue'),
  },
  {
    path: '/plantes',
    name: 'Plantes',
    component: () => import('@/pages/plantePage.vue'),
  },
  {
    path: '/pots',
    name: 'Pots',
    component: () => import('@/pages/potPage.vue'),
  },
  {
    path: '/demandes',
    name: 'Demandes',
    component: () => import('@/pages/demandePage.vue'),
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateurs',
    component: () => import('@/pages/utilisateurPage.vue'),
  },
];

export const icons: Record<string, string> = {
  Accueil: 'mdi-home',
  Batiments: 'mdi-city',
  Plantes: 'mdi-flower',
  Pots: 'mdi-pot',
  Demandes: 'mdi-bell',
  Utilisateurs: 'mdi-account',
};


export default routes;

import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/species/form/:id',
    name: 'SpeciesForm',
    props: true,
    component: () => import('@/pages/species/specieFormPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/buildings/form/:id',
    name: 'BuildingForm',
    props: true,
    component: () => import('@/pages/building/buildingFormPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/buildings/:idBuilding/compartiments',
    name: 'compartiments',
    props: true,
    component: () => import('@/pages/compartiments/compartimentPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/buildings/:idBuilding/compartiments/form/:idCompartiment',
    name: 'compartimentForm',
    props: true,
    component: () => import('@/pages/compartiments/compartimentFormPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/containers/form/:id',
    name: 'ContainerForm',
    props: true,
    component: () => import('@/pages/containers/containerFormPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/buildings/:idBuilding/compartiments/:idCompartiment/view',
    name: 'View',
    props: true,
    component: () => import('@/pages/viewPage.vue'),
    meta: { role: 'grower' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/loginPage.vue'),
    meta: { role: 'any' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/registerPage.vue'),
    meta: { role: 'any' }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/loginPage.vue'),
    meta: { role: 'any' }
  }
];

export default routes;

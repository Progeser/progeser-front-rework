import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/species/form/:id',
    name: 'SpeciesForm',
    props: true,
    component: () => import('@/pages/species/specieFormPage.vue'),
    meta: {role: 'grower'}
  },
  {
    path: '/buildings/form/:id',
    name: 'BuildingForm',
    props: true,
    component: () => import('@/pages/building/buildingFormPage.vue'),
    meta: {role: 'grower'}
  },
  {
    path: '/buildings/:idBuilding/compartiments',
    name: 'compartiments',
    props: true,
    component: () => import('@/pages/compartiments/compartimentPage.vue'),
    meta: {role: 'grower'}
  },
  {
    path: '/buildings/:idBuilding/compartiments/form/:idCompartiment',
    name: 'compartimentForm',
    props: true,
    component: () => import('@/pages/compartiments/compartimentFormPage.vue'),
    meta: {role: 'grower'}
  },
  {
    path: '/containers/form/:id',
    name: 'ContainerForm',
    props: true,
    component: () => import('@/pages/containers/containerFormPage.vue'),
    meta: {role: 'grower'}
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/connexion/loginPage.vue'),
    meta: {role: 'any'}
  },
  {
    path: '/request',
    name: 'Request',
    component: () => import('@/pages/requests/requestFormPage.vue'),
    meta: {role: 'any'}
  },
  {
    path: '/requests/:idRequest/information',
    name: 'RequestInformation',
    component: () => import('@/pages/requests/requestInformationPage.vue'),
    meta: {role: 'grower'}
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/connexion/loginPage.vue'),
    meta: {role: 'any'}
  },
  {
    path: '/greenhouse/:greenhouseId/view',
    name: 'modelingPage',
    props: true,
    component: () => import('@/pages/canvas/modelingPage.vue'),
  },
  {
    path: '/building/:buildingId/greenhouse/:greenhouseId/request/:requestId/view',
    name: 'plantingPage',
    props: true,
    component: () => import('@/pages/canvas/plantingPage.vue'),
  }
];

export default routes;

import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/species/form/:id',
    name: 'SpeciesForm',
    props: true,
    component: () => import('@/pages/species/specieFormPage.vue'),
  },
  {
    path: '/buildings/form/:id',
    name: 'BuildingForm',
    props: true,
    component: () => import('@/pages/building/buildingFormPage.vue'),
  },
  {
    path: '/buildings/:idBuilding/compartiments',
    name: 'compartiments',
    props: true,
    component: () => import('@/pages/compartiments/compartimentPage.vue'),
  },
  {
    path: '/buildings/:idBuilding/compartiments/form/:idCompartiment',
    name: 'compartimentForm',
    props: true,
    component: () => import('@/pages/compartiments/compartimentFormPage.vue'),
  },
  {
    path: '/containers/form/:id',
    name: 'ContainerForm',
    props: true,
    component: () => import('@/pages/containers/containerFormPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/connexion/loginPage.vue'),
  },
  {
    path: '/request',
    name: 'Request',
    component: () => import('@/pages/requests/requestFormPage.vue'),
  },
  {
    path: '/requests/:idRequest/information',
    name: 'RequestInformation',
    component: () => import('@/pages/requests/requestInformationPage.vue'),
  },
  {
    path: '/users/creation',
    name: 'UserCreation',
    component: () => import('@/pages/user/userCreationPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/connexion/loginPage.vue'),
  },
  {
    path: '/buildings/:idBuilding/compartiments/:idCompartiment/view',
    name: 'ModelingPage',
    props: true,
    component: () => import('@/pages/canvas/modelingPage.vue'),
  },
  {
    path: '/building/:buildingId/greenhouse/:greenhouseId/request/:requestId/view',
    name: 'PlantingPage',
    props: true,
    component: () => import('@/pages/canvas/plantingPage.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    props: true,
    component: () => import('@/pages/profile/profilePage.vue'),
  }
];

export default routes;

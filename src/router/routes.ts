import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/species/form/:id',
    name: 'SpeciesForm',
    props: true,
    component: () => import('@/pages/species/specieFormPage.vue'),
    meta: {previousStep: ['species']}
  },
  {
    path: '/buildings/form/:id',
    name: 'BuildingForm',
    props: true,
    component: () => import('@/pages/building/buildingFormPage.vue'),
    meta: {previousStep: ['buildings']}
  },
  {
    path: '/buildings/:idBuilding/compartiments',
    name: 'compartiments',
    props: true,
    component: () => import('@/pages/compartiments/compartimentPage.vue'),
    meta: {previousStep: ['buildings']}
  },
  {
    path: '/buildings/:idBuilding/compartiments/form/:idCompartiment',
    name: 'compartimentForm',
    props: true,
    component: () => import('@/pages/compartiments/compartimentFormPage.vue'),
    meta: {previousStep: ['buildings', 'compartiments']}
  },
  {
    path: '/containers/form/:id',
    name: 'ContainerForm',
    props: true,
    component: () => import('@/pages/containers/containerFormPage.vue'),
    meta: {previousStep: ['containers']}
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
    path: '/requests/:status/:idRequest/show',
    name: 'RequestShow',
    props: true,
    component: () => import('@/pages/requests/requestInformationPage.vue'),
    meta: {previousStep: ['requestsNew']}
  },
  {
    path: '/users/creation',
    name: 'UserCreation',
    component: () => import('@/pages/user/userCreationPage.vue'),
    meta: {previousStep: ['users']}
  },
  {
    path: '/buildings/:idBuilding/compartiments/:idCompartiment/modeling',
    name: 'ModelingPage',
    props: true,
    component: () => import('@/pages/canvas/modelingPage.vue'),
    meta: {previousStep: ['buildings', 'compartiments']}
  },
  {
    path: '/buildings/:idBuilding/compartiments/:idCompartiment/requests/:idRequest/planting',
    name: 'PlantingPage',
    props: true,
    component: () => import('@/pages/canvas/plantingPage.vue'),
    meta: {previousStep: ['buildings', 'compartiments']}
  },
  {
    path: '/profile',
    name: 'Profile',
    props: true,
    component: () => import('@/pages/profile/profilePage.vue'),
  },
  {
    path: '/profile/password',
    name: 'PasswordUpdate',
    props: true,
    component: () => import('@/pages/profile/passwordUpdatePage.vue'),
    meta: {previousStep: ['Profile']}
  },
  { //AT THE END
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/connexion/loginPage.vue'),
  },
  {
    path: '/buildings/:idBuilding/compartiments/:idCompartiment/view',
    name: 'ViewSeedsPage',
    props: true,
    component: () => import('@/pages/canvas/viewPage.vue'),
  }
];

export default routes;

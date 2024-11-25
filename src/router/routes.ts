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
    path: '/buildings/:id/compartiments',
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
    path: '/greenhouse/:greenhouseId/view',
    name: 'view',
    props: true,
    component: () => import('@/pages/viewPage.vue'),
  }
];

export default routes;

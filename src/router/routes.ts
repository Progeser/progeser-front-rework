import {RouteRecordRaw} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: '/species/form/:id',
    name: 'SpeciesForm',
    props: true,
    component: () => import('@/pages/speciesFormPage.vue'),
  },
  {
      path: '/buildings/form/:id',
      name: 'BuildingForm',
      props: true,
      component: () => import('@/pages/buildingFormPage.vue'),
  },
  {
    path: '/buildings/:id/compartiments',
    name: 'compartiments',
    props: true,
    component: () => import('@/pages/compartimentPage.vue'),
  },
  {
    path: '/buildings/:idBuilding/compartiments/form/:idCompartiment',
    name: 'compartimentForm',
    props: true,
    component: () => import('@/pages/compartimentFormPage.vue'),
  }
];

export default routes;

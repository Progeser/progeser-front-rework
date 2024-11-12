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
      component: () => import('@/pages/buildingFormPage.vue'),
  },
  {
    path: '/buildings/:id/compartiments',
    name: 'compartiments',
    props: true,
    component: () => import('@/pages/compartimentPage.vue'),
  }
];

export default routes;

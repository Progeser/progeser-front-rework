// Import des composants de page
import Utilisateurs from '@/views/Utilisateurs.vue';
import Home from "@/components/Home.vue";
import Batiments from "@/components/Batiments.vue";
import Plantes from "@/components/Plantes.vue";
import Pots from "@/components/Pots.vue";

// Définition des routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon : 'mdi-home',
  },
  {
    path: '/batiments',
    name: 'Batiments',
    component: Batiments,
    icon : 'mdi-home',
  },
  {
    path: '/plantes',
    name: 'Plantes',
    component: Plantes,
    icon : 'mdi-flower',
  },
  {
    path: '/pots',
    name: 'Pots',
    component: Pots,
    icon : 'mdi-pot',
  },
  {
    path: '/demandes',
    name: 'Demandes',
    component: Demandes,
    icon : 'mdi-document-file',
  },
  {
    path: '/utilisateurs',
    name: 'Utilisateurs',
    component: Utilisateurs,
    icon : 'mdi-account',
  },
];

export default routes;

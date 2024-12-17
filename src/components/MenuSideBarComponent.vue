<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      class="position-fixed"
      style="background-color: #008B8B; height: 100vh;"
    >
      <v-list>
        <router-link
          :to="item.path"
          v-for="(item, i) in menuRoutes"
          :key="i"
          :class="['router-link-hover', { 'active-link': route.path.includes(item.path) }]"
          style="text-decoration: none;"
        >
          <v-list-item>
            <div class="d-flex align-center">
              <v-icon class="mr-3 text-white">{{ icons[item.name as string] }}</v-icon>
              <v-list-item-title class="text-white">{{ t(`menu.name.${String(item.name)}`) }}</v-list-item-title>
            </div>
          </v-list-item>
        </router-link>
      </v-list>
      <div class="user-profile pa-4" ref="profileMenuActivator">
        <v-menu
          v-model="profileMenu"
          :close-on-content-click="false"
          offset-y
        >
          <template #activator="{ props }">
            <div class="d-flex align-center" v-bind="props">
              <v-avatar size="40" class="mr-3">
                <v-img
                  src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                  alt="Profile"/>
              </v-avatar>
              <div>
                <div class="text-white font-weight-medium">{{ `${user?.first_name} ${user?.last_name}` }}</div>
                <div class="text-white text-caption">{{ user?.email }}</div>
              </div>
            </div>
          </template>
          <v-list>
            <v-list-item @click="redirectToProfilePage">
              <v-list-item-title>Voir le profil</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-navigation-drawer>
    <v-app-bar app color="white">
      <v-row align="center" justify="start">
        <v-col class="d-flex" cols="auto">
          <v-app-bar-nav-icon @click="drawer = !drawer"/>
        </v-col>
        <v-col class="d-flex" cols="auto">
          <img src="@/assets/logo.jpg" alt="Logo" height="50">
        </v-col>
        <NavigationStepper class="ml-2"/>
      </v-row>
    </v-app-bar>
    <v-main class="bg-grey-lighten-2">
      <slot/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import menuRoutes, {icons} from "@/router/menuRoutes";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";
import {UserModel} from "@/model/UserModel";
import {useUserStore} from "@/store/UserStore";
import NavigationStepper from "@/components/NavigationStepper.vue";
import router from "@/router";
import {useAuthStore} from "@/store/AuthStore";

const drawer = ref(false);
const route = useRoute();
const {t} = useI18n();
const userStore = useUserStore();
const user = ref<UserModel | null>(null);
const AuthStore = useAuthStore();
const profileMenu = ref(false);

onBeforeMount(async () => {
    user.value = await userStore.getCurrentUser()
  }
)

const redirectToProfilePage =  () => {
  profileMenu.value = false;
  router.push({name: 'Profile'});
}

const logout = () => {
  profileMenu.value = false;
  AuthStore.logout();
  router.push({name: "Login"});
}
</script>

<style scoped>
.text-white {
  color: white !important;
}

.router-link-hover:hover .v-list-item {
  background-color: #00B0B0;
  transition: background-color 0.3s ease;
  border-radius: 4px;
}

.active-link .v-list-item {
  background-color: #00B0B0 !important;
  border-radius: 4px;
}

.active-link .text-white {
  font-weight: 900;
}

.user-profile {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #008B8B;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.user-profile:hover {
  background-color: #00B0B0;
  transition: background-color 0.3s ease;
  border-radius: 4px;
}
</style>

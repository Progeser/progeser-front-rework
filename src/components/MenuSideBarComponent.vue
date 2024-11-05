<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app style="background-color: #008B8B;">
      <v-list>
        <v-list-item-group>
          <router-link
            :to="item.path"
            v-for="(item, i) in menuRoutes"
            :key="i"
            :class="['router-link-hover', { 'active-link': route.path === item.path }]"
            style="text-decoration: none;"
          >
            <v-list-item>
              <v-list-item-content class="d-flex align-center">
                <v-icon class="mr-3 text-white">{{ icons[item.name as string] }}</v-icon>
                <v-list-item-title class="text-white">{{ t(`menu.name.${String(item.name)}`) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="white">
      <v-row align="center" justify="start">
        <v-col class="d-flex" cols="auto">
          <v-app-bar-nav-icon @click="drawer = !drawer" />
        </v-col>
        <v-col class="d-flex" cols="auto">
          <img src="@/assets/logo.webp" alt="Logo" height="40">
        </v-col>
      </v-row>
    </v-app-bar>
    <v-main class="bg-grey-lighten-2">
        <slot/>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import menuRoutes, { icons } from "@/router/menuRoutes";
import { useRoute } from "vue-router";
import {useI18n} from "vue-i18n";

const drawer = ref(false);
const route = useRoute();
const { t } = useI18n();
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
</style>

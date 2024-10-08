<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app style="background-color: #008B8B;">
      <v-list>
        <v-list-item-group>
          <router-link
            :to="item.path"
            v-for="(item, i) in routes"
            :key="i"
            :class="['router-link-hover', { 'active-link': route.path === item.path }]"
            style="text-decoration: none;"
          >
            <v-list-item>
              <v-list-item-content class="d-flex align-center">
                <v-icon class="mr-3 text-white">{{ icons[item.name] }}</v-icon>
                <v-list-item-title class="text-white">{{ item.name }}</v-list-item-title>
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
          <v-toolbar-title>Uniser</v-toolbar-title>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-main style="background-color: white;">
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import routes, { icons } from "@/router/routes";
import { useRoute } from "vue-router";

const drawer = ref(false);
const route = useRoute();
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

<template>
  <v-app>
    <!-- Sidebar (Navigation Drawer) -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item-group>
          <router-link to="{{ item.path }}" v-for="(item, i) in routes" :key="i">
            <v-list-item>
              <v-list-item-content class="d-flex align-center">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-row align="center" justify="start">
        <v-col class="d-flex" cols="auto">
          <v-app-bar-nav-icon @click="drawer = !drawer" />
        </v-col>
        <v-col class="d-flex" cols="auto">
          <v-toolbar-title>My Application</v-toolbar-title>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1>Welcome to my app!</h1>
        <p>This is the main content area.</p>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import routes from "@/router/routes";

const drawer = ref(false);

</script>

<style scoped>
</style>

<template>
  <v-app>
    <!-- Sidebar (Navigation Drawer) -->
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(item, i) in routes" :key="i" @click="goTo(item.path)">
            <v-list-item-content class="d-flex align-center">
              <v-icon>{{ item.icon }}</v-icon>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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

const goTo = (link: string) => {
  console.log('Navigating to:', link);
};
</script>

<style scoped>
</style>

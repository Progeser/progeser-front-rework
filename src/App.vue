<template>
  <v-app>
    <v-main>
      <MenuSideBar>
        <router-view />
      </MenuSideBar >
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
import MenuSideBar from "@/components/MenuSideBar.vue";
</script>

<template>
  <v-app>
    <v-main>
      <MenuSideBar>
        <v-card class="ma-10 " style="width: calc(100% - 80px); height: calc(100% - 80px);">
          <router-view/>
        </v-card>
      </MenuSideBar>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
import MenuSideBar from "@/components/MenuSideBarComponent.vue";
</script>

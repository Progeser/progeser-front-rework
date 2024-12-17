<template>
  <v-app>
    <v-main>
      <router-view v-if="isLoginRoute"/>
      <MenuSideBar v-else>
        <v-card class="ma-10 " style="width: calc(100% - 80px); height: calc(100% - 80px);">
          <router-view/>
        </v-card>
      </MenuSideBar>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import MenuSideBar from "@/components/MenuSideBarComponent.vue";
import router from "@/router"
import {computed} from "vue";

const isLoginRoute = computed(() => {
  const currentRouteName = router.currentRoute.value.name;
  return currentRouteName === 'Login' || currentRouteName === 'Request' || currentRouteName === 'CatchAll' || router.currentRoute.value.path === '/';
});

</script>

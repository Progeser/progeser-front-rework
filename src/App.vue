<template>
  <v-app>
    <v-snackbar
      v-model="snackbarStore.show"
      :color="snackbarStore.color"
      :timeout="snackbarStore.timeout"
      location="top"
    >
      {{ snackbarStore.message }}
    </v-snackbar>
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
import {useSnackbarStore} from "@/store/snackbarStore";

const isLoginRoute = computed(() => {
  const currentRouteName = router.currentRoute.value.name;
  return currentRouteName === 'Login' || currentRouteName === 'Request' || currentRouteName === 'CatchAll' || router.currentRoute.value.path === '/';
});

const snackbarStore = useSnackbarStore()

</script>

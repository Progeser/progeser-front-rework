<template>
  <v-row>
    <div v-for="(step, index) in routeList" :key="step">
      <div v-if="isNaN(+step)">
        <v-icon v-if="index < routeList.length && index !== 0" :key="step" icon="mdi-chevron-right" class="font-weight-bold"/>
        <router-link :to="getRouteLink(index)">{{ t(`menu.name.${step}`) }}</router-link>
      </div>
    </div>
  </v-row>
</template>

<script setup lang="ts">
import router from "@/router";
import {computed} from "vue";
import {useI18n} from "vue-i18n";

const { t } = useI18n();
const specialCase = ["buildings"]

const routeList = computed(() => router.currentRoute.value.fullPath.split("/").slice(1));

const getRouteLink = (index: number) => {
  if (!isNaN(+routeList.value[index+1]) && !specialCase.some((word) => routeList.value[index].includes(word))) {
    return "/" + routeList.value.slice(0, index + 2).join("/");
  }
  return "/" + routeList.value.slice(0, index + 1).join("/");
};
</script>

<style scoped>
.v-row {
  display: flex;
  align-items: center;
}

.v-row > div {
  display: flex;
  align-items: center;
}

.v-row a {
  text-decoration: none;
  color: #333;
}

.v-row a.router-link-active {
  font-weight: bold;
}
</style>

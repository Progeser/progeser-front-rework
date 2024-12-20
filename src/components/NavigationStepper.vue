<template>
  <v-row>
    <div v-for="(step, index) in routeList" :key="step">
      <v-icon v-if="index < routeList.length && index !== 0" :key="step" icon="mdi-chevron-right" class="font-weight-bold"/>
      <router-link :to="{name: step, params: router.currentRoute.value.params}">{{ t(`menu.name.${step}`) }}</router-link>
    </div>
  </v-row>
</template>

<script setup lang="ts">
import router from "@/router";
import {computed, ComputedRef} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
const routeList: ComputedRef<string[]> = computed((): string[] => [...(router.currentRoute.value.meta.previousStep as string[] || []), router.currentRoute.value.name!.toString()])
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

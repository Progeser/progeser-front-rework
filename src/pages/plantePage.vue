<template>
  <v-container fluid>
    <v-row class="justify-md">
      <div v-for="plant in plantsList" :key="plant.id" class="ma-5">
        <card :title="plant.name"
            img-source="https://media.admagazine.fr/photos/6540db163fc6f8175185f57a/master/w_1600%2Cc_limit/GettyImages-1296861200.jpg"/>
      </div>
      </v-row>
  </v-container>
</template>

<script setup lang="ts">

import FetchService from "@/service/fetchSercice";
import {onBeforeMount, ref, Ref} from "vue";
import {Plant} from "@/model/Plant";
import Card from "@/components/Card.vue";
import { AxiosResponse } from "axios";

const fetchService : FetchService = new FetchService()
let plantsList: Ref<Plant[]> = ref<Plant[]>([]);

onBeforeMount(async () => {
  let test : AxiosResponse<Plant[], any> = await fetchService.get<Plant[]>('plants?page[number]=1&page[size]=10')
  plantsList.value = test.data
})


</script>

<style scoped/>
<template>
  <v-container fluid>
    <v-row class="justify-md">
      <div v-for="plant in plantsList" :key="plant.id" class="ma-5">
        <card :title="plant.name"
            img-source="https://media.admagazine.fr/photos/6540db163fc6f8175185f57a/master/w_1600%2Cc_limit/GettyImages-1296861200.jpg"/>
      </div>
      </v-row>
  </v-container>
  <v-pagination v-if="paginationInformation"
                v-model="pageNumber"
                :length="paginationInformation!.totalPages"/>
</template>

<script setup lang="ts">

  import {onBeforeMount, ref, Ref, watch} from "vue";
  import {Plant} from "@/model/Plant";
  import Card from "@/components/Card.vue";
  import { GenericPagination } from "@/model/GenericPagination";
  import PlantRepository from "@/repository/plantRepository";

  const plantRepository: PlantRepository = new PlantRepository()
  let plantsList: Ref<Plant[]> = ref<Plant[]>([]);
  let pageNumber: Ref<number> = ref<number>(1);
  let paginationInformation: Ref<GenericPagination<Plant[]> | undefined> = ref<GenericPagination<Plant[]> | undefined>();

  const updatePlants = async () => {
    paginationInformation.value = await plantRepository.getPlantsPage(pageNumber.value)
    plantsList.value = paginationInformation.value.content;
  }

onBeforeMount(async () => {
  await updatePlants();
})

watch(pageNumber, () => {
  updatePlants();
})
</script>

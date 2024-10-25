<template>
  <v-container fluid>
    <v-row class="justify-md">
      <div v-for="plant in plantsList" :key="plant.id" class="ma-5">
        <card :title="plant.name"
              img-source="https://media.admagazine.fr/photos/6540db163fc6f8175185f57a/master/w_1600%2Cc_limit/GettyImages-1296861200.jpg"
              :exec="() => navigateToPlatform(plant.id)"
        />
      </div>
      </v-row>
  </v-container>
  <v-pagination v-if="paginationInformation"
                v-model="pageNumber"
                :length="paginationInformation!.totalPages"/>
</template>

<script setup lang="ts">

  import {onBeforeMount, ref, Ref, watch} from "vue";
  import {Species} from "@/model/Species";
  import Card from "@/components/Card.vue";
  import { GenericPagination } from "@/model/GenericPagination";
  import SpeciesRepository from "@/repository/speciesRepository";
  import router from "@/router";

  const plantRepository: SpeciesRepository = new SpeciesRepository()
  const plantsList: Ref<Species[]> = ref<Species[]>([]);
  const pageNumber: Ref<number> = ref<number>(1);
  const paginationInformation: Ref<GenericPagination<Species[]> | undefined> = ref<GenericPagination<Species[]> | undefined>();

  const updatePlants = async () => {
    paginationInformation.value = await plantRepository.getSpeciesPage(pageNumber.value)
    plantsList.value = paginationInformation.value.content;
  }

  const navigateToPlatform = (id : number) => {
    router.push({
      name: 'SpeciesForm',
      params: { id: id.toString() }
    });
  };

onBeforeMount(async () => {
  await updatePlants();
})

watch(pageNumber, () => {
  updatePlants();
})
</script>

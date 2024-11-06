<template>
  <v-container fluid>
    <v-row class="justify-md">
      <div v-for="building in buildingsList" :key="building.id" class="ma-5">
        <card :title="building.name"
              @click="navigateToCompartiments(building.id)"
              img-source="https://img.freepik.com/vecteurs-premium/dessin-batiment-mot-citation-citi-dessine-dessus_951778-115567.jpg" />
      </div>
    </v-row>
    <v-pagination v-if="paginationInformation"
                  v-model="pageNumber"
                  :length="paginationInformation!.totalPages" />
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, watch } from 'vue';
import { Building } from '@/model/Building';
import Card from '@/components/Card.vue';
import { GenericPagination } from '@/model/GenericPagination';
import BuildingRepository from '@/repository/buildingRepository';
import {useRouter} from "vue-router";

const buildingRepository: BuildingRepository = new BuildingRepository();
let buildingsList: Ref<Building[]> = ref<Building[]>([]);
let pageNumber: Ref<number> = ref<number>(1);
let paginationInformation: Ref<GenericPagination<Building[]> | undefined> = ref<GenericPagination<Building[]> | undefined>();
const router = useRouter()

const updateBuildings = async () => {
  paginationInformation.value = await buildingRepository.getBuildingsPage(pageNumber.value);
  buildingsList.value = paginationInformation.value.content;
};

const navigateToCompartiments = (id : number) => {
  router.push({
    name: 'compartiments',
    params: { id: id.toString() }
  });
}

onBeforeMount(async () => {
  await updateBuildings();
});

watch(pageNumber, () => {
  updateBuildings();
});
</script>

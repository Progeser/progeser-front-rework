<template>
  <v-container fluid>
    <div>
      <v-btn @click="navigateToNewBuildingForm()" class="ml-2" variant="outlined" color="primary">
        {{t('common.add')}}
        <v-icon icon="mdi-plus"/>
      </v-btn>
    </div>
    <v-divider class="my-2"/>
    <v-row class="justify-md">
      <div v-for="building in buildingsList" :key="building.id!" class="ma-5">
        <card :title="building.name"
              img-source="https://img.freepik.com/vecteurs-premium/dessin-batiment-mot-citation-citi-dessine-dessus_951778-115567.jpg"
              :exec="() => navigateToBuildingForm(building.id!)"
        />
      </div>
    </v-row>
  </v-container>
  <v-pagination v-if="paginationInformation"
                v-model="pageNumber"
                :length="paginationInformation!.totalPages" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, watch } from 'vue';
import { Building } from '@/model/Building';
import Card from '@/components/Card.vue';
import { GenericPagination } from '@/model/GenericPagination';
import BuildingRepository from '@/repository/buildingRepository';
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
const buildingRepository: BuildingRepository = new BuildingRepository();
let buildingsList: Ref<Building[]> = ref<Building[]>([]);
let pageNumber: Ref<number> = ref<number>(1);
let paginationInformation: Ref<GenericPagination<Building[]> | undefined> = ref<GenericPagination<Building[]> | undefined>();
const {t} = useI18n()
const router = useRouter()

const updateBuildings = async () => {
  paginationInformation.value = await buildingRepository.getBuildingsPage(pageNumber.value);
  buildingsList.value = paginationInformation.value.content;
};

onBeforeMount(async () => {
  await updateBuildings();
});

watch(pageNumber, () => {
  updateBuildings();
});

const navigateToNewBuildingForm = () => {
  router.push({
    name: 'BuildingForm',
    params: { id: 0 }
  });
}

const navigateToBuildingForm = (id: number) => {
  router.push({
    name: 'BuildingForm',
    params: { id: id.toString() }
  });
};
</script>

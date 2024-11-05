<template>
  <v-container fluid>
    <div>
      <v-btn @click="navigateToNewSpeciesForm()" class="ml-2" variant="outlined" color="primary">
        {{t('common.add')}}
        <v-icon icon="mdi-plus"/>
      </v-btn>
    </div>
    <v-divider class="my-2"/>
    <v-row class="justify-md">
      <div v-for="species in speciesList" :key="species.id!" class="ma-5">
        <card :title="species.name"
              img-source="https://media.admagazine.fr/photos/6540db163fc6f8175185f57a/master/w_1600%2Cc_limit/GettyImages-1296861200.jpg"
              :exec="() => navigateToSpeciesForm(species.id!)"
        />
      </div>
      </v-row>
  </v-container>
  <v-pagination v-if="paginationInformation"
                v-model="pageNumber"
                :length="paginationInformation!.totalPages"/>
</template>

<script setup lang="ts">

import {onMounted, ref, Ref, watch} from "vue";
  import {Species} from "@/model/Species";
  import Card from "@/components/Card.vue";
  import { GenericPagination } from "@/model/GenericPagination";
  import {useI18n} from "vue-i18n";
  import {useRouter} from "vue-router";
import SpeciesRepository from "@/repository/speciesRepository";

  const plantRepository: SpeciesRepository = new SpeciesRepository()
  const speciesList: Ref<Species[]> = ref<Species[]>([]);
  const pageNumber: Ref<number> = ref<number>(1);
  const paginationInformation: Ref<GenericPagination<Species[]> | undefined> = ref<GenericPagination<Species[]> | undefined>();
  const {t} = useI18n()
  const router = useRouter()

  const updatePlants = async () => {
    paginationInformation.value = await plantRepository.getSpeciesPage(pageNumber.value)
    speciesList.value = paginationInformation.value.content;
  }

  const navigateToSpeciesForm = (id : number) => {
    router.push({
      name: 'SpeciesForm',
      params: { id: id.toString() }
    });
  };

  const navigateToNewSpeciesForm = () => {
    router.push({
      name: 'SpeciesForm',
      params: { id: 0 }
    });
  }

  onMounted(async () => {
    await updatePlants();
  })


watch(pageNumber, () => {
  updatePlants();
})
</script>

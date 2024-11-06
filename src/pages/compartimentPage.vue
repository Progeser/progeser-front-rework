<template>
  <v-container fluid>
    <div>
      <v-btn @click="navigateToNewCompartimentForm()" class="ml-2" variant="outlined" color="primary">
        {{t('common.add')}}
        <v-icon icon="mdi-plus"/>
      </v-btn>
    </div>
    <v-divider class="my-2"/>
    <v-row class="justify-md">
      <div v-for="species in speciesList" :key="species.id!" class="ma-5">
        <card :title="species.name"
              img-source="https://media.admagazine.fr/photos/6540db163fc6f8175185f57a/master/w_1600%2Cc_limit/GettyImages-1296861200.jpg"
              :exec="() => navigateToCompartimentForm(species.id!)"
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
import Card from "@/components/Card.vue";
import { GenericPagination } from "@/model/GenericPagination";
import {useI18n} from "vue-i18n";
//import {useRouter} from "vue-router";
import CompartimentRepository from "@/repository/compartimentRepository";

const compartimentRepository: CompartimentRepository = new CompartimentRepository()
const speciesList: Ref<Compartiment[]> = ref<Compartiment[]>([]);
const pageNumber: Ref<number> = ref<number>(1);
const paginationInformation: Ref<GenericPagination<Compartiment[]> | undefined> = ref<GenericPagination<Compartiment[]> | undefined>();
const {t} = useI18n()
//const router = useRouter() todo

const props = defineProps<{ id: number }>();

const updateCompartiments = async (buildingId : number) => {
  paginationInformation.value = await compartimentRepository.getCompartimentsPage(buildingId,pageNumber.value)
  speciesList.value = paginationInformation.value.content;
}

const navigateToCompartimentForm = (id : number) => {
  /*router.push({ todo
    name: 'SpeciesForm',
    params: { id: id.toString() }
  });*/
};

const navigateToNewCompartimentForm = () => {
  /*router.push({ todo
    name: 'SpeciesForm',
    params: { id: 0 }
  });*/
}

onMounted(async () => {
  await updateCompartiments(props.id);
})


watch(pageNumber, () => {
  updateCompartiments(props.id);
})
</script>

<style scoped>

</style>

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
      <div v-for="compartiment in compartimentList" :key="compartiment.id!" class="ma-5">
        <card :title="compartiment.name"
              img-source="https://media.admagazine.fr/photos/6540db163fc6f8175185f57a/master/w_1600%2Cc_limit/GettyImages-1296861200.jpg"
              :exec="() => navigateToCompartimentForm(compartiment.id!)"
              :description="makeDescription(compartiment)"
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
import {useRouter} from "vue-router";
import CompartimentRepository from "@/repository/compartimentRepository";
import {Compartiment} from "@/model/Compartiment";

const compartimentRepository: CompartimentRepository = new CompartimentRepository()
const compartimentList: Ref<Compartiment[]> = ref<Compartiment[]>([]);
const pageNumber: Ref<number> = ref<number>(1);
const paginationInformation: Ref<GenericPagination<Compartiment[]> | undefined> = ref<GenericPagination<Compartiment[]> | undefined>();
const {t} = useI18n()
const router = useRouter()

const props = defineProps<{ id: number }>();

const updateCompartiments = async (buildingId : number) => {
  paginationInformation.value = await compartimentRepository.getCompartimentsPage(buildingId,pageNumber.value)
  compartimentList.value = paginationInformation.value.content;
}

const navigateToCompartimentForm = (id : number) => {
  router.push({
    name: 'compartimentForm',
    params: { idBuilding: props.id ,idCompartiment: id.toString() }
  });
};

const navigateToNewCompartimentForm = () => {
  router.push({
    name: 'compartimentForm',
    params: { idBuilding: props.id ,idCompartiment: 0 }
  });
}

const makeDescription = (compartiment : Compartiment) => {
  return `${t(`form.compartiment.occupation`)}${compartiment.occupancy.toString()} %`
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

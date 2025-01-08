<template>
  <v-container fluid>
    <div>
      <v-btn class="ml-2" color="primary" variant="outlined" @click="navigateToNewCompartimentForm()">
        {{ t('common.add') }}
        <v-icon icon="mdi-plus"/>
      </v-btn>
    </div>
    <v-divider class="my-2"/>
    <v-row class="justify-md">
      <div v-for="compartiment in compartimentList" :key="compartiment.id!" class="ma-5">
        <card :exec="() => navigateToCompartimentForm(compartiment.id!)"
              :title="compartiment.name"
              img-source="https://serres.univ-lille.fr/fileadmin/_processed_/4/f/csm_33656_IMG_1477_cellule_e31e62c32f.jpg"
              @click.capture="navigateToView(parseInt(idBuilding),compartiment.id!)"
        />
      </div>
    </v-row>
  </v-container>
  <v-pagination v-if="paginationInformation"
                v-model="pageNumber"
                :length="paginationInformation!.totalPages"/>
</template>

<script lang="ts" setup>

import {onMounted, ref, Ref, watch} from "vue";
import Card from "@/components/Card.vue";
import {GenericPagination} from "@/model/GenericPagination";
import {useI18n} from "vue-i18n";
import router from "@/router"
import CompartimentRepository from "@/repository/compartimentRepository";
import {Compartiment} from "@/model/Compartiment";

const compartimentRepository: CompartimentRepository = new CompartimentRepository()
const compartimentList: Ref<Compartiment[]> = ref<Compartiment[]>([]);
const pageNumber: Ref<number> = ref<number>(1);
const paginationInformation: Ref<GenericPagination<Compartiment[]> | undefined> = ref<GenericPagination<Compartiment[]> | undefined>();
const {t} = useI18n()

const props = defineProps<{ idBuilding: string }>();

const updateCompartiments = async (buildingId: number) => {
  paginationInformation.value = await compartimentRepository.getCompartimentsPage(buildingId, pageNumber.value)
  compartimentList.value = paginationInformation.value.content;
}

const navigateToCompartimentForm = (id: number) => {
  router.push({
    name: 'compartimentForm',
    params: {idBuilding: props.idBuilding, idCompartiment: id.toString()}
  });
};

const navigateToNewCompartimentForm = () => {
  router.push({
    name: 'compartimentForm',
    params: {idBuilding: props.idBuilding, idCompartiment: 0}
  });
}

const navigateToView = (buildingId: number, compartimentId: number) => {
  router.push({
    name: 'ViewSeedsPage',
    params: {idBuilding: buildingId.toString(), idCompartiment: compartimentId},
  });
}

onMounted(async () => {
  await updateCompartiments(parseInt(props.idBuilding));
})

watch(pageNumber, () => {
  updateCompartiments(parseInt(props.idBuilding));
})
</script>

<style scoped>

</style>

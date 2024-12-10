<template>
  <v-container fluid>
    <div>
      <v-btn @click="navigateToNewRequestForm()" class="ml-2" variant="outlined" color="primary">
        {{ t('common.add') }}
        <v-icon icon="mdi-plus" />
      </v-btn>
    </div>
    <v-divider class="my-2" />
    <v-row class="justify-md">
      <div v-for="container in requestsList" :key="container.id!" class="ma-5">

      </div>
    </v-row>
  </v-container>
  <v-pagination v-if="paginationInformation"
                v-model="pageNumber"
                :length="paginationInformation!.totalPages" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref, Ref, watch } from 'vue';
import { GenericPagination } from '@/model/GenericPagination';
import ContainerRepository from '@/repository/containerRepository';
import { useI18n } from "vue-i18n";
import router from "@/router"

const containerRepository: ContainerRepository = new ContainerRepository();
let requestsList: Ref<Container[]> = ref<Container[]>([]);
let pageNumber: Ref<number> = ref<number>(1);
let paginationInformation: Ref<GenericPagination<Container[]> | undefined> = ref<GenericPagination<Container[]> | undefined>();
const { t } = useI18n();

const updateRequests = async () => {
  paginationInformation.value = await containerRepository.getContainersPage(pageNumber.value);
  requestsList.value = paginationInformation.value.content;
};

onBeforeMount(async () => {
  await updateRequests();
});

watch(pageNumber, () => {
  updateRequests();
});

const navigateToNewRequestForm = () => {
  router.push({
    name: 'ContainerForm',
    params: { id: 0 }
  });
};
</script>

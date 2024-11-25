<template>
  <v-container fluid>
    <div>
      <v-btn @click="navigateToNewContainerForm()" class="ml-2" variant="outlined" color="primary">
        {{ t('common.add') }}
        <v-icon icon="mdi-plus" />
      </v-btn>
    </div>
    <v-divider class="my-2" />
    <v-row class="justify-md">
      <div v-for="container in containersList" :key="container.id!" class="ma-5">
        <Card
          :title="container.name"
          img-source="https://easydrawings.net/wp-content/uploads/2020/09/flower-pot-drawing.jpg"
          :exec="() => navigateToContainerForm(container.id!)"
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
import { Container } from '@/model/Container';
import Card from '@/components/Card.vue';
import { GenericPagination } from '@/model/GenericPagination';
import ContainerRepository from '@/repository/containerRepository';
import { useI18n } from "vue-i18n";
import router from "@/router"

const containerRepository: ContainerRepository = new ContainerRepository();
let containersList: Ref<Container[]> = ref<Container[]>([]);
let pageNumber: Ref<number> = ref<number>(1);
let paginationInformation: Ref<GenericPagination<Container[]> | undefined> = ref<GenericPagination<Container[]> | undefined>();
const { t } = useI18n();

const updateContainers = async () => {
  paginationInformation.value = await containerRepository.getContainersPage(pageNumber.value);
  containersList.value = paginationInformation.value.content;
};

onBeforeMount(async () => {
  await updateContainers();
});

watch(pageNumber, () => {
  updateContainers();
});

const navigateToNewContainerForm = () => {
  router.push({
    name: 'ContainerForm',
    params: { id: 0 }
  });
};

const navigateToContainerForm = (id: number) => {
  router.push({
    name: 'ContainerForm',
    params: { id: id.toString() }
  });
};
</script>

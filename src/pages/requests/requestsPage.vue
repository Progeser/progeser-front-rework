<template>
  <v-container fluid>
    <v-divider class="my-2" />
    <v-row>
      <CustomTable
        title="Demandes de cultures"
        :total-pages="paginationInformation?.totalPages ?? 1"
        :total-items="paginationInformation?.totalCount ?? 0"
        :data="requestsList"
        :headers="headers"
        :loading="loading"
        :exec-on-update="updateRequests"
        @update:page="onPageChange"
        @update:items-per-page="onItemsPerPageChange"
      >
        <template v-slot:actions="{ item }">
          <v-btn @click="acceptRequest(item)" class="ml-2" variant="outlined" color="success">
            {{ t('common.accept') }}
            <v-icon icon="mdi-check" />
          </v-btn>
          <v-btn @click="rejectRequest(item)" class="ml-2" variant="outlined" color="error">
            {{ t('common.reject') }}
            <v-icon icon="mdi-close" />
          </v-btn>
        </template>
      </CustomTable>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, watch} from 'vue';
import { GenericPagination } from '@/model/GenericPagination';
import { Request } from '@/model/Request';
import { useI18n } from "vue-i18n";
import { RequestRepository } from "@/repository/requestRepository";
import CustomTable from '@/components/CustomTable.vue';

const requestRepository: RequestRepository = new RequestRepository();
const { t } = useI18n();

const requestsList = ref<Request[]>([]);
const paginationInformation = ref<GenericPagination<Request[]> | undefined>(undefined);
const loading = ref(false);
const pageNumber = ref(1);
const itemsPerPage = ref(10);

const headers = ref([
  { title: t('form.request.table.requesterName'), value: 'requester_name', align: 'center', sortable: true },
  { title: t('form.request.table.email'), value: 'requester_email', align: 'center', sortable: true },
  { title: t('form.request.table.plant'), value: 'plant_name', align: 'center', sortable: true },
  { title: t('form.request.table.quantity'), value: 'quantity', align: 'center', sortable: true },
  { title: t('form.request.table.dueDate'), value: 'due_date', align: 'center', sortable: true },
]);

const updateRequests = async () => {
  loading.value = true;
  try {
    paginationInformation.value = await requestRepository.getRequests(pageNumber.value, itemsPerPage.value);
    requestsList.value = paginationInformation.value.content.map(request => ({
      ...request,
      requester_name: `${request.requester_first_name} ${request.requester_last_name}`,
    }));
  } catch (error) {
    alert(t('request.error'));
  } finally {
    loading.value = false;
  }
};

const onPageChange = (newPage: number) => {
  pageNumber.value = newPage;
};

const onItemsPerPageChange = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
};

const acceptRequest = async (item: any) => {
  if (confirm(t('request.confirmAccept'))) {
    try {
      await requestRepository.acceptRequest(item.id!);
      updateRequests();
    } catch (error) {
      alert(t('request.acceptError'));
    }
  }
};

const rejectRequest = async (item: any) => {
  if (confirm(t('request.confirmReject'))) {
    try {
      await requestRepository.rejectRequest(item.id!);
      updateRequests();
    } catch (error) {
      alert(t('request.rejectError'));
    }
  }
};

onBeforeMount(updateRequests);

watch(pageNumber, updateRequests);
</script>


<template>
  <v-container fluid>
    <v-divider class="my-2"/>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="requestsList"
      :items-length="totalCount"
      :items-per-page-text="t('common.item_per_page')"
      :loading="loading"
      item-value="name"
      style="border: #008B8B 2px solid; border-radius: 10px"
      @update:options="updateOptions"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            class="ml-2"
            color="success"
            variant="outlined"
            @click="acceptRequest(item)"
          >
            {{ t('common.accept') }}
            <v-icon icon="mdi-check"/>
          </v-btn>
          <v-btn
            class="ml-2"
            color="error"
            variant="outlined"
            @click="rejectRequest(item)"
          >
            {{ t('common.reject') }}
            <v-icon icon="mdi-close"/>
          </v-btn>
          <v-btn
            class="ml-2"
            color="primary"
            variant="outlined"
            @click="navigateToInformationPage(item.id)">
            {{ t('common.information') }}
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script lang="ts" setup>
import {onBeforeMount, ref, Ref} from 'vue';
import {Request} from '@/model/Request';
import {useI18n} from "vue-i18n";
import RequestRepository from "@/repository/requestRepository";
import router from "@/router"

const {d, t} = useI18n();

const requestsList = ref<Request[]>([]);
const loading = ref(false);

const pageNumber = ref(1);
const itemsPerPage = ref(10);
const totalCount = ref(0);

const headers: Ref<any> = ref<any>([
  {title: t('form.request.table.requesterName'), key: 'requester_name', align: 'center', sortable: true},
  {title: t('form.request.table.email'), key: 'requester_email', align: 'center', sortable: true},
  {title: t('form.request.table.plant'), key: 'plant_name', align: 'center', sortable: true},
  {title: t('form.request.table.quantity'), key: 'quantity', align: 'center', sortable: true},
  {
    title: t('form.request.table.dueDate'), key: 'due_date', align: 'center', sortable: true,
    value: (item: Request) => !item.due_date ? '' : d(new Date(item.due_date), 'short')
  },
  {title: t('common.actions'), key: 'actions', align: 'center', sortable: false},
]);

const updateRequests = async (page: number, itemsPerPage: number) => {
  loading.value = true;
  try {
    const response = await RequestRepository.getRequests(page, itemsPerPage);
    totalCount.value = response.totalCount || 0;
    requestsList.value = response.content.map((request) => ({
      ...request,
      requester_name: `${request.requester_first_name} ${request.requester_last_name}`,
    }));
  } catch (error) {
    alert(t('request.error'));
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options: { page: number; itemsPerPage: number }) => {
  pageNumber.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  updateRequests(pageNumber.value, itemsPerPage.value);
};

onBeforeMount(() => updateRequests(pageNumber.value, itemsPerPage.value));

const acceptRequest = async (item: Request) => {
  if (confirm(t('request.confirmAccept'))) {
    try {
      await RequestRepository.acceptRequest(item.id!.toString());
      updateRequests(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      alert(t('request.acceptError'));
    }
  }
};

// Fonction pour rejeter une requête
const rejectRequest = async (item: Request) => {
  if (confirm(t('request.confirmReject'))) {
    try {
      await RequestRepository.rejectRequest(item.id!.toString());
      updateRequests(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      alert(t('request.rejectError'));
    }
  }
};

const navigateToInformationPage = async (id: number) => {
  router.push({name: 'RequestInformation', params: {idRequest: id}});
}
</script>

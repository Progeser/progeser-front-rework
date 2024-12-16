<template>
  <v-container fluid>
    <v-divider class="my-2" />
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="requestsList"
      :items-length="totalCount"
      :loading="loading"
      item-value="name"
      :items-per-page-text="t('common.item_per_page')"
      @update:options="updateOptions"
      style="border: #008B8B 2px solid; border-radius: 10px"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            v-if="isNewPage"
            @click="acceptRequest()"
            class="ml-2"
            variant="outlined"
            color="success"
          >
            {{ t('common.accept') }}
            <v-icon icon="mdi-check" />
          </v-btn>
          <v-btn
            v-if="isNewPage"
            @click="rejectRequest(item)"
            class="ml-2"
            variant="outlined"
            color="error"
          >
            {{ t('common.reject') }}
            <v-icon icon="mdi-close" />
          </v-btn>
          <v-btn
            v-if="isAcceptedPage"
            @click="finishRequest(item)"
            class="ml-2"
            variant="outlined"
            color="secondary"
          >
            {{t("common.finish")}}
          </v-btn>
          <v-btn
            @click="navigateToInformationPage(item.id)"
            class="ml-2"
            variant="outlined"
            color="primary">
            {{ t('common.show') }}
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-container>
  <v-dialog v-model="showDialog" max-width="800px">
    <v-card>
      <v-card-title>
        <h1>{{t('request.dialog.title')}}</h1>
      </v-card-title>
      <v-card-text>
        <v-select :items="buildingList" v-model="selectedBuilding" item-title="name" item-value="id" variant="outlined"/>
        <v-select :items="compartimentList" :disabled="selectedBuilding === null" v-model="selectedCompartement" item-title="name" item-value="id" variant="outlined"/>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="cancelDistribution" color="cancel" variant="outlined">
          {{t('common.cancel')}}
        </v-btn>
        <v-btn @click="sendDistribution" color="primary" variant="outlined" :disabled="selectedBuilding === null || selectedCompartement === null">
          {{t('common.send')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { RequestModel } from '@/model/RequestModel';
import {ref, onBeforeMount, Ref, watch, computed} from 'vue';
import { useI18n } from "vue-i18n";
import { RequestRepository } from "@/repository/requestRepository";
import router from "@/router"
import {Building} from "@/model/Building";
import BuildingRepository from "@/repository/buildingRepository";
import {Compartiment} from "@/model/Compartiment";
import CompartimentRepository from "@/repository/compartimentRepository";

const requestRepository = new RequestRepository();
const buildingRepository = new BuildingRepository()
const compartimentRepository = new CompartimentRepository()
const { d,t } = useI18n();

const requestsList = ref<RequestModel[]>([]);
const buildingList = ref<Building[]>([]);
const compartimentList = ref<Compartiment[]>([]);
const loading = ref(false);

const pageNumber = ref(1);
const itemsPerPage = ref(10);
const totalCount = ref(0);
const showDialog = ref(false);
const selectedRequest = ref<number | null>(null);
const selectedBuilding = ref<number | null>(null);
const selectedCompartement = ref<number | null>(null);

const headers: Ref<any> = ref<any>([
  { title: t('form.request.table.requesterName'), key: 'requester_name', align: 'center', sortable: true },
  { title: t('form.request.table.email'), key: 'requester_email', align: 'center', sortable: true },
  { title: t('form.request.table.plant'), key: 'plant_name', align: 'center', sortable: true },
  { title: t('form.request.table.quantity'), key: 'quantity', align: 'center', sortable: true },
  { title: t('form.request.table.dueDate'), key: 'due_date', align: 'center', sortable: true,
    value: (item: RequestModel) => !item.due_date ? '': d(new Date(item.due_date), 'short')},
  { title: t('common.actions'), key: 'actions', align: 'center', sortable: false },
]);

const updateRequests = async (page: number, itemsPerPage: number) => {
  loading.value = true;
  try {
    buildingList.value = await buildingRepository.getAllBuildings()
    const response = await requestRepository.getRequests(page, itemsPerPage,getFetchStatus());
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

const rejectRequest = async (item: RequestModel) => {
  if (confirm(t('request.confirmReject'))) {
    try {
      await requestRepository.rejectRequest(item.id.toString());
      updateRequests(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      alert(t('request.error.fetch'));
    }
  }
}

const finishRequest = async (item: RequestModel) => {
  if (confirm(t('request.confirmReject'))) {
    try {
      await requestRepository.finishRequest(item.id.toString());
      updateRequests(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      alert(t('request.error.fetch'));
    }
  }
}

const acceptRequest = () => {
  showDialog.value = true;
}

const getBuildingCompartiment = async () => {
  if (selectedBuilding.value !== null) {
    compartimentList.value = await compartimentRepository.getAllCompartiments(selectedBuilding.value);
  }
}

const sendDistribution = async () => {
  showDialog.value = false;
  await router.push({name: 'plantingPage', params: {buildingId: selectedBuilding.value,greenhouseId: selectedCompartement.value,requestId: selectedRequest.value}});
  reset()
}

const cancelDistribution = () => {
  showDialog.value = false;
  reset()
}

const navigateToInformationPage = async (id: number) => {
  await router.push({ name: 'RequestShow' , params: { idRequest: id, status: 'new'} });
}

const reset = () => {
  selectedRequest.value = null
  selectedBuilding.value = null
  selectedCompartement.value = null
}

const isNewPage = computed(() => {
  return router.currentRoute.value.name === 'requestsNew';
})

const isAcceptedPage = computed(() => {
  return router.currentRoute.value.name === "requestsAccepted";
})

const getFetchStatus = () => {
  if (isNewPage.value) {
    return "pending"
  }else if (isAcceptedPage.value) {
    return "accepted"
  }else{
    return ""
  }
}

watch(selectedBuilding, async () => {
  selectedCompartement.value = null;
  await getBuildingCompartiment();
})

watch(router.currentRoute,() => {
  requestsList.value = []
  updateRequests(1, itemsPerPage.value)
})

onBeforeMount(() => {
  updateRequests(pageNumber.value, itemsPerPage.value)
});
</script>

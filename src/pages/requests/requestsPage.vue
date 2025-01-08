<template>
  <v-container fluid>
    <v-divider class="my-2"/>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="getHeaders"
      :items="requestsList"
      :items-length="totalCount"
      :items-per-page-options="[10,20,50]"
      :items-per-page-text="t('common.item_per_page')"
      :loading="loading"
      :loading-text="t('common.loading')"
      :no-data-text="t('common.no_data')"
      item-value="name"
      style="border: #008B8B 2px solid; border-radius: 10px"
      @update:options="updateOptions"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            v-if="isNewPage"
            class="ml-2"
            color="success"
            variant="outlined"
            @click="acceptRequest(item)"
          >
            {{ t('common.accept') }}
            <v-icon icon="mdi-check"/>
          </v-btn>
          <v-btn
            v-if="isNewPage"
            class="ml-2"
            color="error"
            variant="outlined"
            @click="rejectRequest(item)"
          >
            {{ t('common.reject') }}
            <v-icon icon="mdi-close"/>
          </v-btn>
          <v-btn
            v-if="isAcceptedPage"
            class="ml-2"
            color="secondary"
            variant="outlined"
            @click="finishRequest(item)"
          >
            {{ t("common.finish") }}
          </v-btn>
          <v-btn
            class="ml-2"
            color="primary"
            variant="outlined"
            @click="navigateToInformationPage(item.id)"
          >
            {{ t('common.show') }}
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-container>
  <v-dialog v-model="showDialog" max-width="800px">
    <v-card>
      <v-card-title class="bg-primary">
        <h1>{{ t('request.dialog.title') }}</h1>
      </v-card-title>
      <v-card-text>
        <h4>{{ t("request.dialog.building") }}</h4>
        <v-select v-model="selectedBuilding" :items="buildingList" :no-data-text="t('common.no_data')" item-title="name"
                  item-value="id"
                  variant="outlined"/>
        <h4>{{ t("request.dialog.compartiment") }}</h4>
        <v-select v-model="selectedCompartement" :disabled="selectedBuilding === null" :items="compartimentList"
                  :no-data-text="t('common.no_data')" item-title="name" item-value="id" variant="outlined"/>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn color="cancel" variant="outlined" @click="cancelDistribution">
          {{ t('common.cancel') }}
        </v-btn>
        <v-btn :disabled="selectedBuilding === null || selectedCompartement === null" color="primary" variant="outlined"
               @click="sendDistribution">
          {{ t('common.send') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {RequestModel} from '@/model/RequestModel';
import {computed, onBeforeMount, Ref, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import RequestRepository from "@/repository/requestRepository";
import router from "@/router"
import {Building} from "@/model/Building";
import BuildingRepository from "@/repository/buildingRepository";
import {Compartiment} from "@/model/Compartiment";
import CompartimentRepository from "@/repository/compartimentRepository";
import UserRepository from "@/repository/userRepository";
import {useSnackbarStore} from "@/store/snackbarStore";

const buildingRepository = new BuildingRepository()
const compartimentRepository = new CompartimentRepository()
const userRepository = new UserRepository()
const {d, t} = useI18n();

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
const sortOption: Ref<[]> = ref([]);
const snackbarStore = useSnackbarStore();

const headers: Ref<any> = ref<any>([
  {title: t('form.request.table.requesterName'), key: 'requester_name', align: 'center', sortable: false},
  {title: t('form.request.table.email'), key: 'requester_email', align: 'center', sortable: false},
  {title: t('form.request.table.plant'), key: 'plant_name', align: 'center', sortable: true},
  {title: t('form.request.table.quantity'), key: 'quantity', align: 'center', sortable: false},
  {
    title: t('form.request.table.dueDate'), key: 'due_date', align: 'center',
    value: (item: RequestModel) => !item.due_date ? '' : d(new Date(item.due_date), 'short'), sortable: true
  },
  {title: t('common.actions'), key: 'actions', align: 'center', sortable: false},
]);

const getHeaders = computed(() => {
  if (isArchivedPage.value) {
    const headersCopy = [...headers.value];
    const newColumn = {
      title: t('form.request.table.status'),
      key: 'status',
      align: 'center',
      value: (item: RequestModel) => t(`form.request.table.status_trad.${item.status}`),
      sortable: true
    };
    const newColumn2 = {title: t('form.request.table.handler'), key: 'handler_name', align: 'center', sortable: false}
    headersCopy.splice(headersCopy.length - 1, 0, newColumn);
    headersCopy.splice(2, 0, newColumn2);
    return headersCopy;
  }
  return headers.value;
});

const getHandlerName = async (id: number | null) => {
  if (id) {
    let handler = await userRepository.getUser(id);
    return `${handler.first_name} ${handler.last_name}`;
  } else {
    return t('common.not_assigned');
  }
};

const updateRequests = async (page: number, itemsPerPage: number) => {
  loading.value = true;
  try {
    // do all fetch in thread
    const [buildingResponse, requestsResponse] = await Promise.all([
      buildingRepository.getAllBuildings(),
      RequestRepository.getRequests(page, itemsPerPage, getFetchStatus(), sortOption.value),
    ]);

    buildingList.value = buildingResponse;
    totalCount.value = requestsResponse.totalCount || 0;

    const mappedRequests = requestsResponse.content.map(request => ({
      ...request,
      requester_name: `${request.requester_first_name} ${request.requester_last_name}`,
      handler_name: null,
    }));

    const handlerNames = await Promise.all(
      requestsResponse.content.map(request => getHandlerName(request.handler_id))
    );

    requestsList.value = mappedRequests.map((request, index) => ({
      ...request,
      handler_name: handlerNames[index],
    }));

  } catch (error) {
    snackbarStore.showMessage(t('request.error.fetch'));
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options: { page: number; itemsPerPage: number, sortBy: [], sortDesc: [], }) => {
  sortOption.value = options.sortBy
  pageNumber.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  updateRequests(pageNumber.value, itemsPerPage.value);
};

const rejectRequest = async (item: RequestModel) => {
  if (confirm(t('request.confirmReject'))) {
    try {
      await RequestRepository.rejectRequest(item.id.toString());
      updateRequests(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      snackbarStore.showMessage(t('request.error.reject'));
    }
  }
}

const finishRequest = async (item: RequestModel) => {
  if (confirm(t('request.confirmFinish'))) {
    try {
      await RequestRepository.finishRequest(item.id.toString());
      updateRequests(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      snackbarStore.showMessage(t('request.error.finish'));
    }
  }
}

const acceptRequest = (item: RequestModel) => {
  showDialog.value = true;
  selectedRequest.value = item.id
}

const getBuildingCompartiment = async () => {
  if (selectedBuilding.value !== null) {
    compartimentList.value = await compartimentRepository.getAllCompartiments(selectedBuilding.value);
  }
}

const sendDistribution = async () => {
  showDialog.value = false;
  await router.push({
    name: 'PlantingPage',
    params: {
      idBuilding: selectedBuilding.value,
      idCompartiment: selectedCompartement.value,
      idRequest: selectedRequest.value
    }
  });
  reset()
}

const cancelDistribution = () => {
  showDialog.value = false;
  reset()
}

const navigateToInformationPage = async (id: number) => {
  await router.push({name: 'RequestShow', params: {idRequest: id, status: 'new'}});
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

const isArchivedPage = computed(() => {
  return router.currentRoute.value.name === 'requestsArchived';
})

const getFetchStatus = () => {
  if (isNewPage.value) {
    return "pending"
  } else if (isAcceptedPage.value) {
    return "accepted"
  } else {
    return ""
  }
}

watch(selectedBuilding, async () => {
  selectedCompartement.value = null;
  await getBuildingCompartiment();
})

watch(router.currentRoute, () => {
  requestsList.value = []
  updateRequests(1, itemsPerPage.value)
})

onBeforeMount(() => {
  updateRequests(pageNumber.value, itemsPerPage.value)
});
</script>

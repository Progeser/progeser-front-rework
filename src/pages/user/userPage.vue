<template>
  <v-container>
    <CustomTable
      :title="t('accountRequest.title')"
      :data="data"
      :headers="headers"
      :loading="loading"
      :exec-on-update="fetchData"
      :total-items="totalItems"
      :total-pages="totalPages"
      @update:page="onPageChange"
      @update:items-per-page="onItemsPerPageChange"
    >
      <template v-slot:actions="{ item }">
        <v-btn color="success" small class="ma-2" @click="activateUser(item)">
          {{ t('common.accept') }}
        </v-btn>
        <v-btn color="error" small class="ma-2" @click="rejectUser(item)">
          {{ t('common.reject') }}
        </v-btn>
      </template>
    </CustomTable>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import AccountRequestRepository from '@/repository/accountsRequestRepository';
import { GenericPagination } from '@/model/GenericPagination';
import { AccountRequest } from '@/model/AccountRequest';
import CustomTable from '@/components/CustomTable.vue';

const { t } = useI18n();
const accountRequestRepository = new AccountRequestRepository();
const data = ref([] as AccountRequest[]);
const loading = ref(false);
let page = ref(1);
let itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

const headers = ref([
  { title: t('accountRequest.table.firstname'), value: 'first_name', align: 'center', sortable: true },
  { title: t('accountRequest.table.lastname'), value: 'last_name', align: 'center', sortable: true },
  { title: t('accountRequest.table.email'), value: 'email', align: 'center', sortable: true },
  { title: t('accountRequest.table.actions'), value: 'actions', align: 'center', sortable: false },
]);

const fetchData = async () => {
  loading.value = true;
  try {
    const paginateAccountRequest: GenericPagination<AccountRequest[]> = await accountRequestRepository.getAccountRequest(page.value, itemsPerPage.value);
    data.value = paginateAccountRequest.content;
    page.value = paginateAccountRequest.currentPage
    totalItems.value = paginateAccountRequest.totalCount;
    totalPages.value = paginateAccountRequest.totalPages
  } catch (error) {
    alert(t('accountRequest.error'));
  } finally {
    loading.value = false;
  }
};

const onPageChange = (newPage: number) => {
  console.log(
    'Page changed to :', newPage
  )
  page.value = newPage;
};

const onItemsPerPageChange = (newItemsPerPage: number) => {
  itemsPerPage.value = newItemsPerPage;
};

onMounted(() => {
  fetchData();
});

const activateUser = (item: any) => {
  console.log('Activation de l\'utilisateur :', item);
};

const rejectUser = (item: any) => {
  console.log('Désactivation de l\'utilisateur :', item);
};
</script>

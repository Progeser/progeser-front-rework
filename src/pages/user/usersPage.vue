<template>
  <v-container fluid>
    <div>
      <v-btn @click="navigateToNewUserForm()" class="ml-2" variant="outlined" color="primary">
        {{ t('common.add') }}
        <v-icon icon="mdi-plus" />
      </v-btn>
    </div>
    <v-divider class="my-2" />
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="usersList"
      :items-length="totalCount"
      :loading="loading"
      :loading-text="t('common.loading')"
      :no-data-text="t('common.no_data')"
      item-value="name"
      :items-per-page-text="t('common.item_per_page')"
      @update:options="updateOptions"
      style="border: #008B8B 2px solid; border-radius: 10px"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex justify-center">
          <v-btn
            v-if="currentUser?.id !== item.id"
            @click="deleteUser(item)"
            class="ml-2"
            variant="outlined"
            color="error"
          >
            {{ t('common.delete') }}
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, Ref, computed } from 'vue';
import { useI18n } from "vue-i18n";
import { UserModel } from "@/model/UserModel";
import UserRepository from "@/repository/userRepository";
import { useUserStore } from "@/store/UserStore";
import router from "@/router";
import {useSnackbarStore} from "@/store/snackbarStore";

// Références
const userRepository = new UserRepository();
const { t } = useI18n();
const snackbarStore = useSnackbarStore();

const usersList = ref<UserModel[]>([]);
const loading = ref(false);

const pageNumber = ref(1);
const itemsPerPage = ref(10);
const totalCount = ref(0);

const headers: Ref<any> = ref<any>([
  { title: t('form.user.table.name'), key: 'name', align: 'center', sortable: true },
  { title: t('form.user.table.email'), key: 'email', align: 'center', sortable: true },
  { title: t('common.actions'), key: 'actions', align: 'center', sortable: false },
]);

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const updateUsers = async (page: number, itemsPerPage: number) => {
  loading.value = true;
  try {
    const response = await userRepository.getUsers(page, itemsPerPage);
    totalCount.value = response.totalCount || 0;
    usersList.value = response.content.map((user: UserModel) => ({
      ...user,
      name: `${user.first_name} ${user.last_name}`,
    }));
  } catch (error) {
    snackbarStore.showMessage(t('form.user.error.fetchUsers'));
  } finally {
    loading.value = false;
  }
};

const updateOptions = (options: { page: number; itemsPerPage: number }) => {
  pageNumber.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  updateUsers(pageNumber.value, itemsPerPage.value);
};

onBeforeMount(async () => {
  await userStore.setCurrentUser();
  await updateUsers(pageNumber.value, itemsPerPage.value);
});

const deleteUser = async (item: UserModel) => {
  if (confirm(t('form.user.confirmDelete'))) {
    try {
      await userRepository.deleteUser(item.id!);
      await updateUsers(pageNumber.value, itemsPerPage.value);
    } catch (error) {
      snackbarStore.showMessage(t('form.user.deleteError'));
    }
  }
};

const navigateToNewUserForm = () => {
  router.push({
    name: 'UserCreation',
  });
};
</script>

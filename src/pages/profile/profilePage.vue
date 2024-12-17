<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="1000" class="pa-5">
      <v-card-title class="text-h5 text-center primary--text">
        {{ t("profile.title") }}
      </v-card-title>

      <v-divider />

      <v-form @submit.prevent="updateUser" class="pa-4">
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t("profile.firstName") }}</h4>
            <v-text-field
              v-model="editableUser.first_name"
              variant="outlined"
              :placeholder="t('profile.firstNamePlaceholder')"
              :rules="[isNotBlank]"
              required
              class="custom-input mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t("profile.lastName") }}</h4>
            <v-text-field
              v-model="editableUser.last_name"
              variant="outlined"
              :placeholder="t('profile.lastNamePlaceholder')"
              :rules="[isNotBlank]"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t("profile.email") }}</h4>
            <v-text-field
              variant="outlined"
              readonly
              class="custom-input mb-4"
              :value="email"
            />
          </v-col>
        </v-row>

        <v-row class="d-flex justify-space-between align-center mt-5">
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            @click="updateUser"
          >
            {{ t("common.edit") }}
          </v-btn>
          <v-btn color="primary" variant="outlined" @click="navigateToUpdatePassword">
            {{ t("profile.updatePassword") }}
          </v-btn>
          <v-btn color="error" @click="deleteUser" variant="outlined">
            {{ t("profile.delete") }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import UserRepository from "@/repository/userRepository";
import { MeOutput } from "@/model/output/MeOutput";
import {useUserStore} from "@/store/UserStore";
import {useAuthStore} from "@/store/AuthStore";
const AuthStore = useAuthStore()
const userStore = useUserStore();
const userRepository = new UserRepository();
const router = useRouter();
const { t } = useI18n();

const editableUser = ref<MeOutput>({
  first_name: "",
  last_name: "",
});

const isNotBlank = (value: string) => value.trim().length > 0 || t("profile.error.required");

const isFormValid = computed(() => {
  return (
    editableUser.value.first_name.trim().length > 0 &&
    editableUser.value.last_name.trim().length > 0
  );
});

const fetchCurrentUser = async () => {
  await userStore.setCurrentUser();
  const currentUser = userStore.currentUser;
  if (currentUser) {
    editableUser.value.first_name = currentUser.first_name;
    editableUser.value.last_name = currentUser.last_name;
  }
};

const email = computed(() => userStore.currentUser?.email);

const updateUser = async () => {
  try {
    await userRepository.updateUser(editableUser.value);
    alert(t("profile.successUpdate"));
    await fetchCurrentUser();
  } catch (error) {
    console.error(error);
    alert(t("profile.errorUpdate"));
  }
};

const deleteUser = async () => {
  if (confirm(t("profile.confirmDelete"))) {
    try {
      await userRepository.destroyCurrentUser();
      logout()
    } catch (error) {
      console.error(error);
      alert(t("profile.errorDelete"));
    }
  }
};

const navigateToUpdatePassword = () => {
  router.push({ name: "updatePassword" });
};

const logout = () => {
  AuthStore.logout();
  router.push({name: "Login"});
}

onMounted(fetchCurrentUser);

</script>

<style scoped>
.primary--text {
  font-weight: bold;
  color: #ffffff;
  background-color: #008b8b;
}

.custom-input :deep(input) {
  font-size: 1em !important;
  height: auto !important;
  padding: 0.5em !important;
}

::v-deep .v-messages__message {
  font-size: 0.9rem !important;
}
</style>

<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="800" class="pa-5">
      <v-card-title class="text-h5 text-center primary--text">
        {{ t('form.user.title') }}
      </v-card-title>

      <v-divider />

      <v-form @submit.prevent="createUser" class="pa-4">
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.user.firstName') }}</h4>
            <v-text-field
              v-model="user.first_name"
              variant="outlined"
              :placeholder="t('form.user.firstNamePlaceholder')"
              :rules="[isNotBlank]"
              required
              class="custom-input mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.user.lastName') }}</h4>
            <v-text-field
              v-model="user.last_name"
              variant="outlined"
              :placeholder="t('form.user.lastNamePlaceholder')"
              :rules="[isNotBlank]"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.user.email') }}</h4>
            <v-text-field
              v-model="user.email"
              variant="outlined"
              type="email"
              :placeholder="t('form.user.emailPlaceholder')"
              :rules="[isValidEmail]"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.user.password') }}</h4>
            <v-text-field
              v-model="user.password"
              type="password"
              variant="outlined"
              :placeholder="t('form.user.passwordPlaceholder')"
              :rules="[isNotBlank]"
              required
              class="custom-input mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.user.confirmPassword') }}</h4>
            <v-text-field
              v-model="user.password_confirmation"
              type="password"
              variant="outlined"
              :placeholder="t('form.user.confirmPasswordPlaceholder')"
              :rules="[isPasswordMatch]"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-row class="d-flex justify-space-between align-center mt-5">
          <v-btn @click="router.push({ name: 'users' })" variant="outlined" class="mr-4">
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn @click="createUser" color="primary" :disabled="!isFormValid">
            {{ t('common.add') }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { UserOutput } from "@/model/output/UserOutput";
import UserRepository from "@/repository/userRepository";

const userRepository = new UserRepository();
const { t } = useI18n();

const user = ref<UserOutput>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const isNotBlank = (value: string) => value.trim().length > 0 || t("form.user.error.required");

const isValidEmail = (value: string) =>
  /^\S+@\S+\.\S+$/.test(value) || t("form.user.error.invalidEmail");

const isPasswordMatch = (value: string) =>
  value === user.value.password || t("form.user.error.passwordMismatch");

const isFormValid = ref(false);

const checkForm = () => {
  isFormValid.value =
    user.value.first_name.trim().length > 0 &&
    user.value.last_name.trim().length > 0 &&
    /^\S+@\S+\.\S+$/.test(user.value.email) &&
    user.value.password.trim().length > 0 &&
    user.value.password === user.value.password_confirmation;
};

const createUser = async () => {
  try {
    await userRepository.createUser(user.value);
    router.push({ name: "users" });
  } catch (error) {
    console.error(error);
    alert(t("form.user.error.creationFailed"));
  }
};

watch(
  () => user.value,
  () => checkForm(),
  { deep: true }
);
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

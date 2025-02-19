<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="400">
      <v-card-title class="text-h6 text-center primary--text">
        {{ t('form.login.title') }}
      </v-card-title>
      <v-form @submit.prevent="handleLogin" ref="loginForm" class="pa-4">
        <h4 class="mr-2 align-self-center">{{ t('form.login.email') }}</h4>
        <v-text-field
          v-model="email"
          variant="outlined"
          placeholder="login@domain.com"
          :rules="[isRequired]"
          required
          class="custom-input align-self-center mb-4"
        />
        <h4 class="mr-2 align-self-center">{{ t('form.login.password') }}</h4>
        <v-text-field
          v-model="password"
          type="password"
          variant="outlined"
          placeholder="********"
          :rules="[isRequired]"
          required
          class="custom-input align-self-center mb-4"
        />
        <v-btn
          class="mt-4"
          block
          color="primary"
          type="submit"
          :loading="isLoading"
          :disabled="!isFormValid"
        >
          {{ t('common.send') }}
        </v-btn>
        <v-row class="ma-2 mt-3">
          <v-col class="pa-0">
    <span>
      {{ t('form.login.requester') }}
      <v-btn
        variant="text"
        color="primary"
        class="pa-0"
        style="min-width: auto; padding: 0;"
        @click="router.push({name: 'Request'})"
      >
        {{ t('form.login.here') }}
      </v-btn>
    </span>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/store/AuthStore";
import {computed, ref} from "vue";
import router from "@/router"
import {useI18n} from "vue-i18n";
import {useSnackbarStore} from "@/store/snackbarStore";

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();
const {t} = useI18n();


const isRequired = (value: string) => {
  return value.trim().length > 0 || t('form.login.required');
};

const isFormValid = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length > 0;
});

const handleLogin = async () => {
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push({name: "requestsNew"});
  } catch (error) {
    snackbarStore.showMessage(t("form.login.error"));
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.primary--text {
  font-weight: bold;
  color: #ffffff;
  background-color: #008b8b;
}
</style>

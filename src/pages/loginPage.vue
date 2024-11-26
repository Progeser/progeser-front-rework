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
        <!-- Register Link -->
        <v-row justify="center" class="mt-4" align="center">
          <span>{{ t('form.login.noAccount') }}</span>
          <v-btn
            variant="text"
            color="primary"
            @click="navigateToRegister"
            class="ml-2"
          >
            {{ t('form.login.registerHere') }}
          </v-btn>
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

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const authStore = useAuthStore();
const {t} = useI18n();


// Validation des champs
const isRequired = (value: string) => {
  return value.trim().length > 0 || t('form.login.required');
};

// Vérification globale du formulaire
const isFormValid = computed(() => {
  return email.value.trim().length > 0 && password.value.trim().length > 0;
});

// Gestion de l'authentification


const navigateToRegister = () => {
  router.push("/register");
};

const handleLogin = async () => {
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push("/home");
  } catch (error) {
    alert(t("form.login.error"));
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

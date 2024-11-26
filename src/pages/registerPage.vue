<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="600">
      <v-card-title class="text-h6 text-center primary--text">
        {{ t('form.register.title') }}
      </v-card-title>
      <v-form @submit.prevent="handleSubmit" ref="registerForm" class="pa-4">
        <!-- Nom et Prénom -->
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.register.firstName') }}</h4>
            <v-text-field
              v-model="firstName"
              variant="outlined"
              :placeholder="t('form.register.firstNamePlaceholder')"
              :rules="[isRequired]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.register.lastName') }}</h4>
            <v-text-field
              v-model="lastName"
              variant="outlined"
              :placeholder="t('form.register.lastNamePlaceholder')"
              :rules="[isRequired]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
        </v-row>

        <!-- Adresse e-mail et Laboratoire -->
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.register.email') }}</h4>
            <v-text-field
              v-model="email"
              variant="outlined"
              type="email"
              :placeholder="t('form.register.emailPlaceholder')"
              :rules="[isRequired, isEmail]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.register.lab') }}</h4>
            <v-text-field
              v-model="lab"
              variant="outlined"
              :placeholder="t('form.register.labPlaceholder')"
              class="custom-input align-self-center mb-4"
            />
          </v-col>
        </v-row>

        <!-- Mot de passe et Confirmation -->
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.register.password') }}</h4>
            <v-text-field
              v-model="password"
              type="password"
              variant="outlined"
              :placeholder="t('form.register.passwordPlaceholder')"
              :rules="[isRequired, isPasswordStrong]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.register.confirmPassword') }}</h4>
            <v-text-field
              v-model="confirmPassword"
              type="password"
              variant="outlined"
              :placeholder="t('form.register.confirmPasswordPlaceholder')"
              :rules="[isRequired, isPasswordMatch]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
        </v-row>

        <!-- Motif -->
        <h4 class="mr-2 align-self-center">{{ t('form.register.reason') }}</h4>
        <v-textarea
          v-model="reason"
          variant="outlined"
          :placeholder="t('form.register.reasonPlaceholder')"
          rows="4"
          class="custom-input align-self-center mb-4"
        />

        <!-- Bouton soumettre -->
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

        <!-- Lien vers la connexion -->
        <v-row justify="center" class="mt-4" align="center">
          <span>{{ t('form.register.alreadyAccount') }}</span>
          <v-btn
            variant="text"
            color="primary"
            @click="navigateToLogin"
            class="ml-2"
          >
            {{ t('form.register.loginHere') }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import {AccountRequestOutput} from "@/model/output/AccountRequestOutput";
import AccountRequestRepository from "@/repository/accountsRequestRepository";

// Champs
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const lab = ref("");
const reason = ref("");
const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);

// Validation des champs
const isRequired = (value: string) => {
  return value.trim().length > 0 || t("form.register.required");
};
const isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) || t("form.register.invalidEmail");
};
const isPasswordStrong = (value: string) => {
  return value.length >= 8 || t("form.register.passwordTooWeak");
};
const isPasswordMatch = (value: string) => {
  return value === password.value || t("form.register.passwordMismatch");
};

const isFormValid = computed(() => {
  return (
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    password.value.trim().length > 0 &&
    confirmPassword.value === password.value
  );
});

const router = useRouter();
const { t } = useI18n();
const accountRequestRepository = new AccountRequestRepository();

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const accountRequestOutput: AccountRequestOutput = new AccountRequestOutput(
      email.value,
      firstName.value,
      lastName.value,
      lab.value,
      reason.value,
      password.value
    );
    await accountRequestRepository.postAccountRequest(accountRequestOutput);
    alert(t("form.register.success"));
    await router.push("/login");
  } catch (error) {
    console.error(error);
    alert(t("form.register.error"));
  } finally {
    isLoading.value = false;
  }
};

const navigateToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.primary--text {
  font-weight: bold;
  color: #ffffff;
  background-color: #008b8b;
}
</style>

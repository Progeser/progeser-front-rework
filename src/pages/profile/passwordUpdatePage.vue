<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="600" class="pa-5">
      <v-card-title class="text-h5 text-center primary--text">
        {{ t("password.title") }}
      </v-card-title>

      <v-divider />

      <v-form @submit.prevent="updatePassword" class="pa-4" v-model="valid" lazy-validation>
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t("password.currentPassword") }}</h4>
            <v-text-field
              v-model="form.current_password"
              variant="outlined"
              :placeholder="t('password.currentPasswordPlaceholder')"
              :rules="[rules.required]"
              type="password"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t("password.newPassword") }}</h4>
            <v-text-field
              v-model="form.password"
              variant="outlined"
              :placeholder="t('password.newPasswordPlaceholder')"
              :rules="[rules.required, rules.minLength(8)]"
              type="password"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t("password.confirmPassword") }}</h4>
            <v-text-field
              v-model="form.password_confirmation"
              variant="outlined"
              :placeholder="t('password.confirmPasswordPlaceholder')"
              :rules="[rules.required, rules.matchPassword]"
              type="password"
              required
              class="custom-input mb-4"
            />
          </v-col>
        </v-row>

        <v-alert v-if="errorMessage" type="error" class="mt-3">
          {{ errorMessage }}
        </v-alert>
        <v-alert v-if="successMessage" type="success" class="mt-3">
          {{ successMessage }}
        </v-alert>

        <v-row class="d-flex justify-space-between align-center mt-5">
          <v-btn
            color="primary"
            variant="outlined"
            @click="resetForm"
          >
            {{ t("password.resetButton") }}
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!valid"
            @click="updatePassword"
          >
            {{ t("password.updateButton") }}
          </v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import PasswordRepository from "@/repository/passwordRepository";
import { PasswordUpdateOutput } from "@/model/output/PasswordUpdateOutput";
import router from "@/router";

const { t } = useI18n();
const passwordRepository = new PasswordRepository();

const form = ref<PasswordUpdateOutput>({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const valid = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const rules = {
  required: (v: string) => !!v || t("common.required"),
  minLength: (length: number) => (v: string) =>
    v.length >= length || t("password.minLength", { length }),
  matchPassword: (v: string) =>
    v === form.value.password || t("password.passwordMismatch"),
};

const updatePassword = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await passwordRepository.updatePassword(form.value);
    successMessage.value = t("password.successUpdate");
    router.push("/profile");
  } catch (error) {
    errorMessage.value = t("password.errorUpdate");
  }
};

const resetForm = () => {
  form.value = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };
  errorMessage.value = "";
  successMessage.value = "";
};
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

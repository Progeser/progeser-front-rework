<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="800">
      <v-card-title class="text-h6 text-center primary--text">
        {{ t('form.request.title') }}
      </v-card-title>
      <v-form ref="registerForm" class="pa-4" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.firstName') }}</h4>
            <v-text-field
              v-model="firstName"
              :placeholder="t('form.request.firstNamePlaceholder')"
              :rules="[isRequired]"
              class="custom-input align-self-center mb-4"
              required
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.lastName') }}</h4>
            <v-text-field
              v-model="lastName"
              :placeholder="t('form.request.lastNamePlaceholder')"
              :rules="[isRequired]"
              class="custom-input align-self-center mb-4"
              required
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.email') }}</h4>
            <v-text-field
              v-model="email"
              :rules="[isRequired, isEmail]"
              class="custom-input align-self-center mb-4"
              placeholder="request@domain.com"
              required
              type="email"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.request.due_date') }} : </h4>
            <v-date-input
              v-model="date"
              :rules="[isNotNull]"
              min-width="180"
              placeholder="DD/MM/YYYY"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.request.subject') }}</h4>
            <v-text-field
              v-model="subject"
              :placeholder="t('form.request.subjectPlaceholder')"
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.lab') }}</h4>
            <v-text-field
              v-model="lab"
              :placeholder="t('form.request.labPlaceholder')"
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.species') }}</h4>
            <v-select
              ref="speciesSelect"
              v-model="selectedSpecies"
              :items="[...species, { id: -1, name: t('form.edit.otherSpecies') }]"
              :loading="isLoading"
              :no-data-text="t('common.no_data')"
              :rules="[isNotNull]"
              item-title="name"
              return-object
              variant="outlined"
              @update:modelValue="onSpecieChange"
            />
          </v-col>
          <v-col cols="4" v-if="isOtherSpecies">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.plantName') }}</h4>
            <v-text-field
              v-model="plantName"
              :placeholder="t('form.edit.plantName')"
              :rules="[isRequired]"
              class="custom-input align-self-center mb-4"
              required
              variant="outlined"
            />
          </v-col>
          <v-col cols="4" v-if="!isOtherSpecies">
            <h4 class="mr-2 align-self-center">{{ t('form.request.stage') }}</h4>
            <v-select
              v-model="selectedSpeciesStageId"
              :disabled="selectedSpecies === null"
              :items="selectedSpecies?.plant_stages"
              :rules="[isNotNull]"
              :no-data-text="t('common.no_data')"
              item-title="name"
              item-value="id"
              variant="outlined"
              @update:modelValue="onStageChange"
            />
          </v-col>
          <v-col cols="4" v-if="isOtherSpecies">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.plantStageName') }}</h4>
            <v-text-field
              v-model="plantStageName"
              :placeholder="t('form.edit.plantStageName')"
              :rules="[isRequired]"
              class="custom-input align-self-center mb-4"
              required
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.quantity') }}</h4>
            <v-text-field v-model="quantity" :rules="[isGreaterThanZero]" type="number" variant="outlined"/>
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.temperature') }}</h4>
            <v-select
              v-model="temperature"
              :items="temperatureField"
              :rules="[isNotNull]"
              :no-data-text="t('common.no_data')"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.photoperiod') }}</h4>
            <v-text-field v-model="photoperiod" :rules="[isGreaterThanZero]" type="number" variant="outlined" suffix="h"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.reason') }}</h4>
            <v-textarea
              v-model="reason"
              :placeholder="t('form.request.reasonPlaceholder')"
              class="custom-input align-self-center mb-4"
              rows="4"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-btn
          :disabled="!isFormValid"
          :loading="isLoading"
          block
          class="mt-4"
          color="primary"
          type="submit"
        >
          {{ t('common.send') }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, ref} from "vue";
import {useI18n} from "vue-i18n";
import {Species} from "@/model/Species";
import SpeciesRepository from "@/repository/speciesRepository";
import {RequestOutput} from "@/model/output/RequestOutput";
import RequestRepository from "@/repository/requestRepository";
import {useSnackbarStore} from "@/store/snackbarStore";

const {t} = useI18n();
const speciesRepository = new SpeciesRepository();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const lab = ref("");
const reason = ref("");
const species = ref<Species[]>([]);
const selectedSpecies = ref<Species | null>(null);
const selectedSpeciesStageId = ref<number | null>(null);
const plantName = ref<string | null>("");
const plantStageName = ref<string | null>("");
const isLoading = ref(false);
const subject = ref("");
const quantity = ref(0);
const temperature = ref(null);
const photoperiod = ref(0);
const date = ref<Date | null>(null);
const snackbarStore = useSnackbarStore();

const temperatureField = ["Chaud", "Froid", "Extérieur", "Autre"];

const isOtherSpecies = computed(() => selectedSpecies.value?.id === -1);

const isRequired = (value: string) =>
  value.trim().length > 0 || t("form.edit.error.required");

const isGreaterThanZero = (value: number) =>
  value > 0 || t("form.edit.error.greaterThanZero");

const isNotNull = (value: Object) =>
  value !== null || t("form.edit.error.notNull");

const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t("form.edit.error.invalidEmail");

const isFormValid = computed(() => {
  return (
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    subject.value.trim().length > 0 &&
    (selectedSpeciesStageId.value !== null || selectedSpecies.value?.id === -1) &&
    (plantName.value !== null || selectedSpecies.value?.id != -1) &&
    (plantStageName.value !== null || selectedSpecies.value?.id != -1) &&
    date.value !== null &&
    quantity.value > 0 &&
    temperature.value !== null &&
    photoperiod.value !== null &&
    photoperiod.value > 0 && photoperiod.value < 25
  );
});

const fetchSpecies = async () => {
  isLoading.value = true;
  try {
    species.value = await speciesRepository.getAllSpecies();
  } catch (error) {
    snackbarStore.showMessage(t('form.request.error.fetchSpecies'));
  } finally {
    isLoading.value = false;
  }
};

function onSpecieChange() {
  selectedSpeciesStageId.value = null;
  plantName.value = null;
  plantStageName.value = null;
}

function onStageChange(stageId: number | null) {
  if (stageId !== null) {
    const selectedStage = selectedSpecies.value?.plant_stages.find(
      (stage) => stage.id === stageId
    );
    plantStageName.value = selectedStage?.name || null;
  }
}

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const requestOutput = new RequestOutput(
      email.value,
      firstName.value,
      lastName.value,
      lab.value,
      subject.value,
      reason.value,
      isOtherSpecies.value ? null : selectedSpeciesStageId.value,
      isOtherSpecies.value ? plantName.value : selectedSpecies.value?.name,
      isOtherSpecies.value ? plantStageName.value : selectedSpecies.value?.plant_stages.find(stage => stage.id === selectedSpeciesStageId.value)?.name,
      date.value?.toString(),
      quantity.value,
      temperature.value,
      photoperiod.value
    );
    await RequestRepository.postRequest(requestOutput);
    snackbarStore.showMessage(t('form.request.success'));
    resetForm();
  } catch (error) {
    snackbarStore.showMessage(t('form.request.error.sending'));
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  email.value = '';
  firstName.value = '';
  lastName.value = '';
  lab.value = '';
  subject.value = '';
  reason.value = '';
  selectedSpecies.value = null;
  selectedSpeciesStageId.value = null;
  date.value = null;
  quantity.value = 0;
  temperature.value = null;
  photoperiod.value = 0;
  plantName.value = '';
  plantStageName.value = '';
};

onBeforeMount(fetchSpecies);
</script>

<style scoped>
.primary--text {
  font-weight: bold;
  color: #ffffff;
  background-color: #008b8b;
}
</style>

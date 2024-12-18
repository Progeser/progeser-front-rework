<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="800">
      <v-card-title class="text-h6 text-center primary--text">
        {{ t('form.request.title') }}
      </v-card-title>
      <v-form ref="registerForm" class="pa-4" @submit.prevent="handleSubmit">
        <!-- Ligne 1 -->
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

        <!-- Ligne 2 -->
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.lab') }}</h4>
            <v-text-field
              v-model="lab"
              :placeholder="t('form.request.labPlaceholder')"
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.species') }}</h4>
            <v-select ref="speciesSelect"
                      v-model="selectedSpecies"
                      :items="species"
                      :loading="isLoading"
                      :no-data-text="t('common.no_data')"
                      :rules="[isNotNull]"
                      item-title="name"
                      return-object
                      variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.stage') }}</h4>
            <v-select v-model="selectedSpeciesStageId" :disabled="selectedSpecies === null"
                      :items="selectedSpecies?.plant_stages"
                      :rules="[isNotNull]"
                      :no-data-text="t('common.no_data')"
                      item-title="name"
                      item-value="id"
                      variant="outlined"/>
          </v-col>
        </v-row>

        <!-- Ligne 3 -->
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.quantity') }}</h4>
            <v-text-field v-model="quantity" :rules="[isGreaterThanZero]" type="number" variant="outlined"/>
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.temperature') }}</h4>
            <v-select v-model="temperature"
                      :items="temperatureField"
                      :rules="[isNotNull]"
                      :no-data-text="t('common.no_data')"
                      variant="outlined"/>
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.photoperiod') }}</h4>
            <v-text-field v-model="photoperiod" :rules="[isGreaterThanZero]" type="number" variant="outlined" suffix="h"/>
          </v-col>
        </v-row>

        <!-- Ligne 4 -->
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
          <v-col cols="8" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.request.subject') }}</h4>
            <v-text-field
              v-model="subject"
              :placeholder="t('form.request.subjectPlaceholder')"
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
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

        <!-- Bouton -->
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
import {computed, onBeforeMount, Ref, ref} from "vue";
import {useI18n} from "vue-i18n";
import {Species} from "@/model/Species";
import SpeciesRepository from "@/repository/speciesRepository";
import {RequestOutput} from "@/model/output/RequestOutput";
import RequestRepository from "@/repository/requestRepository";

const speciesRepository = new SpeciesRepository();
const {t} = useI18n();
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const lab = ref("");
const reason = ref("");
const species: Ref<Species[]> = ref([]);
const selectedSpecies: Ref<Species | null> = ref(null);
const selectedSpeciesStageId: Ref<number | null> = ref(null);
const isLoading = ref(false);
const subject = ref("");
const quantity = ref(0);
const temperature = ref(null);
const photoperiod = ref(0);
const date = ref<Date | null>(null);

const isRequired = (value: string) =>
  value.trim().length > 0 || t("form.request.error.required");
const isGreaterThanZero = (value: number) => {
  return value > 0 || t("form.request.error.greaterThanZero");
}
const isNotNull = (value: Object) => {
  return (value !== null || value !== undefined) || t("form.request.error.notNull");
}
const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t("form.request.error.invalidEmail");

const temperatureField = ["Chaud","Froid","Extérieur","Autre"]

const isFormValid = computed(() => {
  return (
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    subject.value.trim().length > 0 &&
    selectedSpeciesStageId.value !== null &&
    date.value !== null &&
    quantity.value > 0 &&
    temperature.value !== null &&
    photoperiod.value > 0
  );
});


const fetchSpecies = async () => {
  isLoading.value = true;
  try {
    const fetchedSpecies = await speciesRepository.getAllSpecies();
    species.value = fetchedSpecies;

  } catch (error) {
    alert(t('form.request.error.fetchSpecies'))
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const requestOutput: RequestOutput = new RequestOutput(
      email.value,
      firstName.value,
      lastName.value,
      lab.value,
      subject.value,
      reason.value,
      selectedSpeciesStageId.value,
      date.value,
      quantity.value,
      temperature.value,
      photoperiod.value
    );
    await RequestRepository.postRequest(requestOutput);
    alert(t('form.request.success'))
    resetForm()
  } catch (error) {
    alert(t('form.request.error.sending'))
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  email.value = ''
  firstName.value = ''
  lastName.value = ''
  lab.value = ''
  subject.value = ''
  reason.value = ''
  selectedSpecies.value = null
  selectedSpeciesStageId.value = null
  date.value = null
  quantity.value = 0
  temperature.value = null
  photoperiod.value = 0
}

onBeforeMount(async () => {
  await fetchSpecies();
});
</script>


<style scoped>
.primary--text {
  font-weight: bold;
  color: #ffffff;
  background-color: #008b8b;
}
</style>

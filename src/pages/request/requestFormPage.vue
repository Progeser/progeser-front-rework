<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="600">
      <v-card-title class="text-h6 text-center primary--text">
        {{ t('form.request.title') }}
      </v-card-title>
      <v-form @submit.prevent="handleSubmit" ref="registerForm" class="pa-4">
        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.firstName') }}</h4>
            <v-text-field
              v-model="firstName"
              variant="outlined"
              :placeholder="t('form.request.firstNamePlaceholder')"
              :rules="[isRequired]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.lastName') }}</h4>
            <v-text-field
              v-model="lastName"
              variant="outlined"
              :placeholder="t('form.request.lastNamePlaceholder')"
              :rules="[isRequired]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.email') }}</h4>
            <v-text-field
              v-model="email"
              variant="outlined"
              type="email"
              placeholder="request@domain.com"
              :rules="[isRequired, isEmail]"
              required
              class="custom-input align-self-center mb-4"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.lab') }}</h4>
            <v-text-field
              v-model="lab"
              variant="outlined"
              :rules="[isRequired]"
              :placeholder="t('form.request.labPlaceholder')"
              class="custom-input align-self-center mb-4"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.species') }}</h4>
            <v-select ref="speciesSelect"
                      :items="species"
                      item-title="name"
                      v-model="selectedSpecies"
                      variant="outlined"
                      return-object
                      :rules="[isNotNull]"
                      :loading="isLoading"
            />
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.stage') }}</h4>
            <v-select :disabled="selectedSpecies === null" :items="selectedSpecies?.plant_stages"
                      item-title="name"
                      item-value="id"
                      :rules="[isNotNull]"
                      v-model="selectedSpeciesStageId"
                      variant="outlined"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.quantity') }}</h4>
            <v-text-field type="number" v-model="quantity" :rules="[isGreaterThanZero]" variant="outlined"/>
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.temperature') }}</h4>
            <v-text-field type="number" v-model="temperature" :rules="[isGreaterThanZero]" variant="outlined"/>
          </v-col>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.photoperiod') }}</h4>
            <v-text-field type="number" v-model="photoperiod" :rules="[isGreaterThanZero]" variant="outlined"/>
          </v-col>
        </v-row>
        <v-row class="justify-center align-center">
          <v-col cols="auto" class="text-center">
            <h4 class="mr-2 align-self-center">{{ t('form.request.due_date') }} : </h4>
            <v-date-input
              v-model="date"
              min-width="200"
              :rules="[isNotNull]"
              variant="outlined"
              placeholder="DD/MM/YYYY"
            />
          </v-col>
        </v-row>

        <v-col>
          <h4 class="mr-2 align-self-center">{{ t('form.request.subject') }}</h4>
          <v-textarea
            v-model="subject"
            variant="outlined"
            :placeholder="t('form.request.reasonPlaceholder')"
            rows="2"
            class="custom-input align-self-center mb-4"
          />

          <h4 class="mr-2 align-self-center">{{ t('form.request.reason') }}</h4>
          <v-textarea
            v-model="reason"
            variant="outlined"
            :placeholder="t('form.request.reasonPlaceholder')"
            rows="4"
            class="custom-input align-self-center mb-4"
          />

        </v-col>


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
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, Ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { Species } from "@/model/Species";
import SpeciesRepository from "@/repository/speciesRepository";
import {RequestOutput} from "@/model/output/RequestOutput";
import RequestRepository from "@/repository/requestRepository";

const speciesRepository = new SpeciesRepository();
const resquestRepository = new RequestRepository()
const { t } = useI18n();
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
const temperature = ref(0);
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

const isFormValid = computed(() => {
  return (
    firstName.value.trim().length > 0 &&
    lastName.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    lab.value.trim().length > 0 &&
      subject.value.trim().length > 0 &&
      selectedSpeciesStageId.value !== null &&
      date.value !== null &&
      quantity.value > 0 &&
      temperature.value > 0 &&
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
    const requestOutput : RequestOutput = new RequestOutput(
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
    await resquestRepository.postRequest(requestOutput);
    resetForm()
  }catch (error) {
    console.log(error);
    alert(t('form.request.error.sending'))
  }finally {
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
  temperature.value = 0
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

<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="800">
      <v-card-title class="text-h6 text-center primary--text">
        {{ t('form.edit.title') }}
      </v-card-title>
      <v-form ref="editForm" class="pa-4" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.firstName') }}</h4>
            <v-text-field
              v-model="firstName"
              :placeholder="t('form.edit.firstNamePlaceholder')"
              :rules="[isRequired]"
              class="custom-input align-self-center mb-4"
              required
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.lastName') }}</h4>
            <v-text-field
              v-model="lastName"
              :placeholder="t('form.edit.lastNamePlaceholder')"
              :rules="[isRequired]"
              class="custom-input align-self-center mb-4"
              required
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.email') }}</h4>
            <v-text-field
              v-model="email"
              :rules="[isRequired, isEmail]"
              class="custom-input align-self-center mb-4"
              placeholder="edit@domain.com"
              required
              type="email"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.lab') }}</h4>
            <v-text-field
              v-model="lab"
              :placeholder="t('form.edit.labPlaceholder')"
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.species') }}</h4>
            <v-select ref="speciesSelect"
                      v-model="selectedSpecies"
                      :items="species"
                      :loading="isLoading"
                      :no-data-text="t('common.no_data')"
                      :rules="[isNotNull]"
                      item-title="name"
                      return-object
                      variant="outlined"
                      @update:modelValue="onSpecieChange"

            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.stage') }}</h4>
            <v-select v-model="selectedSpeciesStageId" :disabled="selectedSpecies === null"
                      :items="selectedSpecies?.plant_stages"
                      :rules="[isNotNull]"
                      :no-data-text="t('common.no_data')"
                      item-title="name"
                      item-value="id"
                      variant="outlined"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.quantity') }}</h4>
            <v-text-field v-model="quantity" :rules="[isGreaterThanZero]" type="number" variant="outlined"/>
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.temperature') }}</h4>
            <v-select v-model="temperature"
                      :items="temperatureField"
                      :rules="[isNotNull]"
                      :no-data-text="t('common.no_data')"
                      variant="outlined"/>
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.edit.photoperiod') }}</h4>
            <v-text-field v-model="photoperiod" :rules="[isGreaterThanZero, isSmallerThanTwentyFive]" type="number" variant="outlined" suffix="h"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.edit.due_date') }} : </h4>
            <v-date-input
              v-model="date"
              :rules="[isNotNull]"
              min-width="180"
              placeholder="DD/MM/YYYY"
              variant="outlined"
            />
          </v-col>
          <v-col cols="8" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.edit.subject') }}</h4>
            <v-text-field
              v-model="subject"
              :placeholder="t('form.edit.subjectPlaceholder')"
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.edit.reason') }}</h4>
            <v-textarea
              v-model="reason"
              :placeholder="t('form.edit.reasonPlaceholder')"
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
          {{ t('common.update') }}
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
import RequestRepository from "@/repository/requestRepository";
import {RequestOutput} from "@/model/output/RequestOutput";
import router from "@/router";

const speciesRepository = new SpeciesRepository();
const {t} = useI18n();
const props = defineProps<{ idRequest: string }>();

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
const temperature = ref<string | null>(null);
const photoperiod = ref<number | null>(null);
const date = ref<Date | null>(null);

const isRequired = (value: string) =>
  value.trim().length > 0 || t("form.edit.error.required");
const isGreaterThanZero = (value: number) => {
  return value > 0 || t("form.edit.error.greaterThanZero");
};

const isSmallerThanTwentyFive = (value: number) => {
  return value < 25 || t("form.edit.error.smallerThanTwentyFive");
};

const isNotNull = (value: Object) => {
  return (value !== null || true) || t("form.edit.error.notNull");
};
const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t("form.edit.error.invalidEmail");

const temperatureField = ["Chaud", "Froid", "Extérieur", "Autre"];

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
    photoperiod.value !== null &&
    photoperiod.value > 0 && photoperiod.value < 25
  );
});

const fetchSpecies = async () => {
  isLoading.value = true;
  try {
    species.value = await speciesRepository.getAllSpecies();
  } catch (error) {
    alert(t('form.edit.error.fetchSpecies'));
  } finally {
    isLoading.value = false;
  }
};

const loadRequestData = async () => {
  isLoading.value = true;
  try {
    const request = await RequestRepository.getRequest(props.idRequest);
    email.value = request.requester_email;
    firstName.value = request.requester_first_name;
    lastName.value = request.requester_last_name;
    lab.value = request.laboratory;
    subject.value = request.name;
    reason.value = request.comment || '';
    selectedSpecies.value = species.value.find(species => species.id === request.plant_id) || null;
    selectedSpeciesStageId.value = request.plant_stage_id;
    date.value = request.due_date ? new Date(request.due_date) : null;
    quantity.value = request.quantity;
    temperature.value = request.temperature || null;
    photoperiod.value = request.photoperiod || null;
  } catch (error) {
    alert(t('form.edit.error.loadRequest'));
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
      temperature.value!.toString(),
      photoperiod.value
    );
    await RequestRepository.putRequest(props.idRequest, requestOutput);
    router.push({name: 'requestsNew'});
  } catch (error) {
    alert(t('form.edit.error.update'));
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(async () => {
  await fetchSpecies();
  await loadRequestData();
});

function onSpecieChange() {
  selectedSpeciesStageId.value = null;
}

</script>

<style scoped>
.primary--text {
  font-weight: bold;
  color: #ffffff;
  background-color: #008b8b;
}
</style>

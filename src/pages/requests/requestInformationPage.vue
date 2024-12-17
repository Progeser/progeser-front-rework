<template>
  <v-container v-if="requestInformation" class="fill-height d-flex justify-center align-center">
    <v-card elevation="3" width="800">
      <v-card-title class="text-h6 text-center bg-primary">
        {{ t('form.request.title') }}
      </v-card-title>
      <v-card-text class="mt-5">
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.firstName') }}</h4>
            <v-text-field
              v-model="requestInformation!.requester_first_name"
              class="custom-input align-self-center mb-4"
              readonly
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.lastName') }}</h4>
            <v-text-field
              v-model="requestInformation!.requester_last_name"
              class="custom-input align-self-center mb-4"
              readonly
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.email') }}</h4>
            <v-text-field
              v-model="requestInformation!.requester_email"
              class="custom-input align-self-center mb-4"
              readonly
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.lab') }}</h4>
            <v-text-field
              v-model="requestInformation!.laboratory"
              readonly
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.species') }}</h4>
            <v-text-field
              v-model="requestInformation!.plant_name"
              readonly
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.stage') }}</h4>
            <v-text-field
              v-model="requestInformation!.plant_stage_name"
              readonly
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <!-- Ligne 3 -->
        <v-row>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.quantity') }}</h4>
            <v-text-field v-model="requestInformation!.quantity" readonly type="number" variant="outlined" class="custom-input align-self-center mb-4"/>
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.temperature') }}</h4>
            <v-text-field
              v-model="requestInformation!.temperature"
              class="custom-input align-self-center mb-4"
              readonly
              variant="outlined"
            />
          </v-col>
          <v-col cols="4">
            <h4 class="mr-2 align-self-center">{{ t('form.request.photoperiod') }}</h4>
            <v-text-field v-model="requestInformation!.photoperiod" readonly type="number" variant="outlined" suffix="h" class="custom-input align-self-center mb-4"/>
          </v-col>
        </v-row>

        <!-- Ligne 4 -->
        <v-row>
          <v-col cols="4" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.request.due_date') }} : </h4>
            <v-date-input
              v-model="requestInformation!.due_date"
              min-width="180"
              readonly
              placeholder="DD/MM/YYYY"
              variant="outlined"
            />
          </v-col>
          <v-col cols="8" align-self-center>
            <h4 class="mr-2 align-self-center">{{ t('form.request.subject') }}</h4>
            <v-text-field
              v-model="requestInformation!.name"
              readonly
              class="custom-input align-self-center mb-4"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <h4 class="mr-2 align-self-center">{{ t('form.request.reason') }}</h4>
            <v-textarea
              readonly
              v-model="requestInformation!.comment"
              class="custom-input align-self-center mb-4"
              rows="4"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import RequestRepository from "@/repository/requestRepository";
import {RequestModel} from "@/model/RequestModel";

const props = defineProps({
  idRequest: {
    type: Number,
    required: true
  }
});

const { t } = useI18n();
const requestInformation = ref<RequestModel | null>(null);

onBeforeMount(async () => {
  if (props.idRequest) {
    try {
      requestInformation.value = await RequestRepository.getRequest(props.idRequest);
    } catch (error) {
      console.error("Erreur lors de la récupération de la requête :", error);
    }
  }
});
</script>

<style scoped>
.display_information {
  border: #008B8B 2px solid;
  border-radius: 5px;
}
</style>

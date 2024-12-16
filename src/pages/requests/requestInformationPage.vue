<template>
    <v-container v-if="requestInformation" class="fill-height d-flex justify-center align-center">
      <v-card elevation="3" width="600">
        <v-card-title class="text-h6 text-center primary--text">
          {{ t('form.request.title') }}
        </v-card-title>
        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.firstName') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.requester_first_name}}</p>
            </div>
          </v-col>
          <v-col>
            <h4>{{ t('form.request.lastName') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.requester_last_name}}</p>
            </div>
          </v-col>
        </v-row>

        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.email') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.requester_email}}</p>
            </div>
          </v-col>
          <v-col>
            <h4>{{ t('form.request.lab') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.laboratory}}</p>
            </div>
          </v-col>
        </v-row>

        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.species') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.plant_name}}</p>
            </div>
          </v-col>
          <v-col>
            <h4>{{ t('form.request.stage') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.plant_stage_name}}</p>
            </div>
          </v-col>
        </v-row>

        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.quantity') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.quantity}}</p>
            </div>
          </v-col>
          <v-col>
            <h4>{{ t('form.request.temperature') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.temperature}}</p>
            </div>
          </v-col>
          <v-col>
            <h4>{{ t('form.request.photoperiod') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.photoperiod}}</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.due_date') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.due_date}}</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.subject') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.name}}</p>
            </div>
          </v-col>
        </v-row>
        <v-row class="mr-2 align-self-center">
          <v-col>
            <h4>{{ t('form.request.reason') }}</h4>
            <div class="display_information">
              <p>{{requestInformation.comment}}</p>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { RequestRepository } from "@/repository/requestRepository";
import {RequestModel} from "@/model/RequestModel";

const props = defineProps({
  idRequest: {
    type: Number,
    required: true
  }
});

const { t } = useI18n();
const requestInformation = ref<RequestModel | null>(null);

const requestRepository = new RequestRepository();

onBeforeMount(async () => {
  if (props.idRequest) {
    try {
      requestInformation.value = await requestRepository.getRequest(props.idRequest);
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

<template>
  <div class="ma-10" v-if="compartiment">
    <v-row class=" justify-space-between align-center">
      <h1>{{t('form.compartiment.title')}}</h1>
      <v-btn color="error" @click="deleteCompartiment()" class="align-self-center">{{t('common.delete')}}</v-btn>
    </v-row>
    <v-col class="ma-5">
      <v-col>
        <h2 class="mr-2 align-self-center">{{t('form.compartiment.nameTitle')}}</h2>
        <v-text-field
          v-model="compartiment.name"
          variant="outlined"
          class="custom-input align-self-center"
          hide-details
        />
      </v-col>
    </v-col>
    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'compartiments', params: {id: props.idBuilding} })">{{ t('common.cancel') }}</v-btn>
      <v-btn @click="sendCompartiment()" color="primary">{{ t('common.send') }}</v-btn>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {Compartiment} from "@/model/Compartiment";
import CompartimentRepository from "@/repository/compartimentRepository";

const compartimentRepository = new CompartimentRepository()
const compartiment = ref<Compartiment>(new Compartiment());
const router = useRouter();
const { t } = useI18n();

const props = defineProps<{ idBuilding: number, idCompartiment: number }>();

const updateCompartiment = async () => {
  if (props.idCompartiment.toString() !== '0') {
    compartiment.value = await compartimentRepository.getCompartiment(props.idCompartiment);
  }
};

const sendCompartiment = async () => {
  if (props.idCompartiment.toString() !== '0') {
    await compartimentRepository.putCompartiment(compartiment.value?.id!, compartiment.value);
  } else {
    await compartimentRepository.postCompartiment(props.idBuilding,compartiment.value);
  }
  await router.push({name: 'compartiments', params: {id: props.idBuilding}});
};

const deleteCompartiment = async () => {
  if (confirm(t('form.compartiment.confirmDelete'))) {
    await compartimentRepository.deleteCompartiment(compartiment.value.id!);
    await router.push({ name: 'compartiments', params: {id: props.idBuilding} });
  }
};

onBeforeMount(async () => {
  await updateCompartiment();
});
</script>

<style scoped>
.custom-input :deep(input) {
  font-size: 1em !important;
  height: auto !important;
  padding: 0.5em !important;
}
</style>

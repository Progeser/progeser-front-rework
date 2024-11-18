<template>
  <div class="ma-10" v-if="compartiment">
    <v-row class=" justify-space-between align-center">
      <h1>{{t('form.compartiment.title')}}</h1>
      <v-btn color="error" @click="deleteCompartiment()" class="align-self-center">{{t('common.delete')}}</v-btn>
    </v-row>
    <div class="ma-5">
      <v-col>
        <h2 class="mr-2 align-self-center">{{t('form.compartiment.nameTitle')}}</h2>
        <v-text-field
          v-model="compartiment.name"
          variant="outlined"
          class="custom-input align-self-center"
          :rules="[isNotBlanck]"
        />
        <v-row class="mt-2">
          <v-col>
            <h2 class="mr-2 align-self-center">{{t('form.compartiment.width')}}</h2>
            <v-text-field type="number"
                          variant="outlined"
                          v-model="compartiment.width"
                          :rules="[isStriclyPositive]"/>
          </v-col>
          <v-col>
            <h2 class="mr-2 align-self-center">{{t('form.compartiment.height')}}</h2>
            <v-text-field type="number"
                          variant="outlined"
                          v-model="compartiment.height"
                          :rules="[isStriclyPositive]"/>
          </v-col>
        </v-row>
      </v-col>
    </div>
    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'compartiments', params: {id: props.idBuilding} })">
        {{ t('common.cancel') }}
      </v-btn>
      <v-btn @click="sendCompartiment()"
             color="primary"
             :disabled="compartiment.width <= 0 || compartiment.height <= 0 || compartiment.name.trim().length <= 0">
        {{ t('common.send') }}
      </v-btn>
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

const isStriclyPositive = (value: number) => {
  return value >= 1 || t('form.compartiment.error.value');
}

const isNotBlanck = (value: string) => {
  return value.trim().length >= 1 || t('form.compartiment.error.name');
}

onBeforeMount(async () => {
  await updateCompartiment();
});
</script>

<style>
.custom-input :deep(input) {
  font-size: 1em !important;
  height: auto !important;
  padding: 0.5em !important;
}

.v-messages__message {
  font-size: 1em !important;
}
</style>

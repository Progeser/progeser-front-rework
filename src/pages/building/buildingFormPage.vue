<template>
  <div class="ma-10" v-if="building">
    <v-row class=" justify-space-between align-center">
      <h1>{{t('form.building.title')}}</h1>
      <v-btn color="error" @click="deleteBuilding()" class="align-self-center">{{t('common.delete')}}</v-btn>
    </v-row>
    <v-col class="ma-5">
      <v-col>
        <h2 class="mr-2 align-self-center">{{t('form.building.nameTitle')}}</h2>
        <v-text-field
          v-model="building.name"
          variant="outlined"
          class="custom-input align-self-center"
          :rules="[isNotBlanck]"
        />
      </v-col>
      <v-col>
        <h2 class="mr-2">{{t('form.building.description')}}</h2>
        <v-textarea
          v-model="building.description"
          variant="outlined"
          class="custom-input"
          rows="5"
          auto-grow
        />
      </v-col>
    </v-col>
    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'buildings' })">{{ t('common.cancel') }}</v-btn>
      <v-btn @click="sendBuilding()" color="primary" :disabled="building.name.trim().length <= 0">{{ t('common.send') }}</v-btn>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import BuildingRepository from "@/repository/buildingRepository";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {Building} from "@/model/Building";

const buildingRepository = new BuildingRepository();
const building = ref<Building>(new Building());
const router = useRouter();
const { t } = useI18n();

const props = defineProps<{ id: number }>();

const updateBuilding = async () => {
  if (props.id.toString() !== '0') {
    building.value = await buildingRepository.getBuilding(props.id);
  }
};

const sendBuilding = async () => {
  if (props.id.toString() !== '0') {
    await buildingRepository.putBuilding(building.value?.id!, building.value);
  } else {
    await buildingRepository.postBuilding(building.value);
  }
  await router.push({name: 'buildings'});
};

const deleteBuilding = async () => {
  if (confirm(t('form.building.confirmDelete'))) {
    await buildingRepository.deleteBuilding(building.value.id!);
    await router.push({ name: 'buildings' });
  }
};

const isNotBlanck = (value: string) => {
  return value.trim().length >= 1 || t('form.building.error.name');
}

onBeforeMount(async () => {
  await updateBuilding();
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

<template>
  <div class="ma-5" v-if="building">
    <v-row class="ma-5 justify-space-between align-center">
      <h1 class="mr-2">{{ t('form.building.title') }}</h1>
      <v-btn icon @click="deleteBuilding" v-if="props.id.toString() !== '0'">
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-row>

    <v-row class="ma-5">
      <v-text-field
        v-model="building.name"
        variant="plain"
        class="custom-input"
        hide-details
        :label="t('form.building.name')"
      />
    </v-row>

    <v-row class="ma-5">
      <v-textarea
        v-model="building.description"
        variant="outlined"
        class="custom-input"
        :label="t('form.building.description')"
        rows="5"
        auto-grow
      />
    </v-row>

    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'buildings' })">{{ t('common.cancel') }}</v-btn>
      <v-btn @click="sendBuilding()" color="primary">{{ t('common.send') }}</v-btn>
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

onBeforeMount(async () => {
  await updateBuilding();
});
</script>

<style scoped>
.custom-input :deep(input) {
  font-size: 1em !important;
  height: auto !important;
  padding: 0.5em !important;
}
</style>

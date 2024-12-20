<template>
  <div class="ma-10" v-if="species">
    <v-row class="justify-space-between align-center">
      <h1>{{t('form.species.title')}}</h1>
      <v-btn color="error" @click="deleteSpecies()" class="align-self-center">{{t('common.delete')}}</v-btn>
    </v-row>
    <v-col class="ma-5">
      <h2 class="mr-2 mb-4 align-self-center">{{t('form.species.nameTitle')}}</h2>
      <v-text-field
        v-model="species.name"
        variant="outlined"
        class="custom-input align-self-center mb-4"
        :rules="[isNotBlanck]"
      />
      <v-row class="mb-4">
        <h2 class="mr-2">{{t('form.species.stageTitle')}}</h2>
        <v-btn @click="addStage" class="ml-2" variant="outlined" color="primary">
          {{t('common.add')}}
          <v-icon icon="mdi-plus"/>
        </v-btn>
      </v-row>
      <v-list class="border">
        <v-list-item v-for="(element, index) in stages" :key="index">
          <v-row class="d-flex align-center" v-if="element._destroy !== true">
            <v-col cols="5" class="d-flex align-center">
              <v-text-field
                v-model="element.name"
                :label="t('form.species.drag.name')"
                density="compact"
                variant="outlined"
                :rules="[isNotBlanck]"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="5" class="d-flex align-center">
              <v-text-field
                v-model="element.duration"
                :label="t('form.species.drag.time')"
                density="compact"
                variant="outlined"
                type="number"
                :rules="[validationTime]"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="2" class="d-flex align-center">
              <v-btn
                @click="element._destroy = true"
                color="error"
              >
                <v-icon icon="mdi-trash-can-outline"/>
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-col>
    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'species' })">{{t('common.cancel')}}</v-btn>
      <v-btn @click="sendSpecies()" color="primary" :disabled="species.name.trim().length <= 0 || species.plant_stages.filter(stage => stage.name.trim().length <= 0 || stage.duration <= 0).length >= 1">
        {{t('common.send')}}
      </v-btn>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, Ref, ref, watch} from "vue";
import {Species} from "@/model/Species";
import SpeciesRepository from "@/repository/speciesRepository";
import {SpeciesStage} from "@/model/SpeciesStage";
import router from "@/router"
import {useI18n} from "vue-i18n";

const speciesRepository = new SpeciesRepository();
const species: Ref<Species> = ref<Species>(new Species());
const stages: Ref<SpeciesStage[]> = ref([]);
const { t } = useI18n()

const props = defineProps<{ id: string }>();

const updatePlants = async () => {
  if(props.id.toString() !== '0'){
    species.value = await speciesRepository.getSpecies(parseInt(props.id));
    stages.value = species.value.plant_stages;
    stages.value.sort((a, b) => a.duration - b.duration);
  }
};

watch(stages, (newStages) => {
  newStages.forEach((stage, index) => {
    stage.position = index;
  });
}, {deep: true});

const addStage = () => {
  stages.value.push(new SpeciesStage());
}

const sendSpecies = async () => {
  species.value.plant_stages = stages.value;
  if (props.id !== '0'){
    await speciesRepository.putSpecies(species.value.id!,species.value)
  }else{
    await speciesRepository.postSpecies(species.value)
  }
  await router.push({ name: 'species' })
}

const deleteSpecies = async () => {
  if (confirm(t('form.species.confirmDelete'))) {
    await speciesRepository.deleteSpecies(species.value.id!)
    await router.push({name: 'species'})
  }
}

const validationTime = (value: number) => {
  return value >= 1 || t('form.species.error.time');
}

const isNotBlanck = (value: string) => {
  return value.trim().length >= 1 || t('form.species.error.name');
}

onBeforeMount(async () => {
  await updatePlants();
});
</script>

<style scoped>
.v-list-item {
  width: 100%;
  background: white;
}

.v-row {
  width: 100%;
  margin: 0;
}

.custom-input :deep(input) {
  font-size: 1em !important;
  height: auto !important;
  padding: 0.5em !important;
}

::v-deep .v-messages__message {
  font-size: 1rem !important;
}
</style>

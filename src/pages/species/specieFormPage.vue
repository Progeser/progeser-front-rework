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
        hide-details
      />
      <v-row class="mb-4">
        <h2 class="mr-2">{{t('form.species.stageTitle')}}</h2>
        <v-btn @click="addStage" class="ml-2" variant="outlined" color="primary">
          {{t('common.add')}}
          <v-icon icon="mdi-plus"/>
        </v-btn>
      </v-row>
      <draggable
        v-model="stages"
        tag="div"
        :component-data="{
      tag: 'ul',
      type: 'transition-group',
    }"
        item-key="id"
        :animation="200"
        ghost-class="ghost-class"
        @start="drag=true"
        @end="onDragEnd"
        class="border"
      >
        <template #item="{ element }">
          <v-list-item :key="element.id" class="drag-item">
            <v-row class="d-flex align-center">
              <v-col cols="auto" class="icon-col d-flex align-center">
                <v-icon>mdi-drag</v-icon>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="element.name"
                  :label="t('form.species.drag.name')"
                  density="compact"
                  variant="outlined"
                />
              </v-col>
              <v-col>
                <v-text-field
                  v-model="element.duration"
                  :label="t('form.species.drag.time')"
                  density="compact"
                  variant="outlined"
                  type="number"
                  :rules="[validationTime]"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </template>
      </draggable>
    </v-col>
    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'species' })">{{t('common.cancel')}}</v-btn>
      <v-btn @click="sendSpecies()" color="primary">{{t('common.send')}}</v-btn>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeMount, Ref, ref, watch} from "vue";
import {Species} from "@/model/Species";
import SpeciesRepository from "@/repository/speciesRepository";
import {SpeciesStage} from "@/model/SpeciesStage";
import draggable from 'vuedraggable';
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const speciesRepository = new SpeciesRepository();
const species: Ref<Species> = ref<Species>(new Species());
const stages: Ref<SpeciesStage[]> = ref([]);
const drag = ref(false);
const router = useRouter()
const { t } = useI18n()

const props = defineProps<{ id: number }>();

const updatePlants = async () => {
  if(props.id.toString() !== '0'){
    species.value = await speciesRepository.getSpecies(props.id);
    stages.value = species.value.plant_stages;
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

const onDragEnd = async () => {
  drag.value = false;
  stages.value.forEach((stage, index) => {
    stage.position = index;
  });
};

const sendSpecies = async () => {
  species.value.plant_stages = stages.value;
  if (props.id.toString() !== '0'){
    await speciesRepository.putSpecies(species.value.id!,species.value)
  }else{
    await speciesRepository.postSpecies(species.value)
  }
  await router.push({ name: 'species' })
}

const deleteSpecies = async () => {
  await speciesRepository.deleteSpecies(species.value.id!)
  await router.push({name: 'species'})
}

const validationTime = (value: number) => {
  return value >= 1 || t('form.species.error.time');
}

onBeforeMount(async () => {
  await updatePlants();
});
</script>

<style scoped>
.drag-item {
  cursor: move;
  width: 100%;
}

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

.ma-10 {
  margin: 10px;
}

.ma-5 {
  margin: 5px;
}
</style>

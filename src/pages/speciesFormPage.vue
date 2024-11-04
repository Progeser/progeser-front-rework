<template>
    <v-col class="ma-5" v-if="species">
        <div class="d-flex align-center">
            <h1 class="mr-2">Nom :</h1>
            <v-text-field
                v-model="species.name"
                variant="plain"
                class="custom-input"
                hide-details
            ></v-text-field>
        </div>
        <h2>Stage :</h2>
        <v-btn @click="addStage">Ajouter <v-icon icon="mdi-plus"/></v-btn>
        <v-list>
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
                <template #item="{ element, index }">
                    <v-list-item :key="element.id" class="drag-item pa-4">
                        <template #prepend>
                            <v-icon class="mr-4">mdi-drag</v-icon>
                        </template>
                        <v-row align="center" class="pa-2">
                            <v-col cols="3" verrical-align="middle">
                                <v-text-field
                                    v-model="element.name"
                                    label="Nom"
                                    density="compact"
                                    variant="outlined"
                                />
                            </v-col>
                            <v-col cols="2">
                                <v-text-field
                                    v-model="element.position"
                                    :value="index"
                                    label="Position"
                                    density="compact"
                                    variant="outlined"
                                    readonly
                                />
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                    v-model="element.duration"
                                    label="Durée"
                                    density="compact"
                                    variant="outlined"
                                    type="number"
                                />
                            </v-col>
                        </v-row>
                    </v-list-item>
                </template>
            </draggable>
        </v-list>
    </v-col>
</template>

<script lang="ts" setup>
import {onBeforeMount, Ref, ref, watch} from "vue";
import {Species} from "@/model/Species";
import SpeciesRepository from "@/repository/speciesRepository";
import {SpeciesStage} from "@/model/SpeciesStage";
import draggable from 'vuedraggable';

const speciesRepository = new SpeciesRepository();
const species: Ref<Species | null> = ref<Species | null>(null);
const stages: Ref<SpeciesStage[]> = ref([]);
const drag = ref(false);

const props = defineProps<{ id: number }>();

const updatePlants = async () => {
    species.value = await speciesRepository.getSpecies(props.id);
    stages.value = species.value.plant_stages;
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

    try {
        // Exemple:
        // await speciesRepository.updateStages(stages.value);
    } catch (error) {
        console.error('Erreur lors de la mise à jour des stages:', error);
    }
};

onBeforeMount(async () => {
    await updatePlants();
});
</script>

<style scoped>
.drag-item {
    cursor: move;
}

.ghost-class {
    opacity: 0.5;
    background: #c8ebfb;
}

.drag-item:hover {
    background: rgba(0, 0, 0, 0.04);
}

.v-list-item {
    transition: background-color 0.2s ease;
}

.custom-input :deep(input) {
    font-size: 2em !important;
    font-weight: bold;
    height: auto !important;
    padding: 0 !important;
}
</style>

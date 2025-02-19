<template>
  <v-container class="container" fluid>
    <div ref="containerRef" class="canvas-container">
      <GridComponent
        :offset="canvasOffset"
        :size="containerSize"
        :space="30"/>
      <BenchesComponent
        :benches="benchStore.benches"
        :corner-size="0"
        :display-labels="false"
        :is-editing="false"
        :offset="canvasOffset"
        :selected-bench-id="null"
        :size="containerSize"/>
      <DistributionComponent
        :bench-store="benchStore"
        :corner-size="0"
        :current-request-id="null"
        :display-pots-quantity="true"
        :distribution="requestDistributionStore.requestDistributions"
        :is-editing="false"
        :offset="canvasOffset"
        :selected-distribution-id="selectedDistributionId"
        :size="containerSize"
        :unhighlighted-ids="unhighlightedDistributionId"/>
    </div>
    <ToolsComponent
      :onToolSelect="handleToolSelect"
      :selected="selectedTool"
      :tools="toolList"
      class="tools"
    />
    <div class="box-container">
      <PlantListComponent
        :on-selected-plant="handlePlantSelect"
        :plant="plantList"
        :selected="selectedPlantId"
        class="plant-list-box"
      />
      <RequestInfoComponent
        :info="requestInfo"
        class="info-box"
      />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, Ref, ref} from "vue";
import RequestInfoComponent from "@/components/canvas/RequestInfoComponent.vue";
import GridComponent from "@/components/canvas/GridComponent.vue";
import BenchesComponent from "@/components/canvas/BenchesComponent.vue";
import ToolsComponent from "@/components/canvas/ToolsComponent.vue";
import DistributionComponent from "@/components/canvas/DistributionsComponent.vue";
import PlantListComponent from "@/components/canvas/PlantListComponent.vue";
import {useBenchStore} from "@/store/BenchStore";
import {useRequestDistributionStore} from "@/store/RequestDistribution";
import {
  ApplyMouseMoveOnOffset,
  CreateContainerResizeObserver,
  CursorPointerWhenOverDistributions,
  DistributionUnderCursor,
  GetRequestInfoFromDistribution,
  Offsets,
  Position,
  RequestInfoData,
  Size
} from "@/utils/canvas";
import {usePlantStore} from "@/store/PlantStore";
import {useRequestStore} from "@/store/RequestStore";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const containerRef: Ref<HTMLElement | undefined> = ref();
const containerSize: Ref<Size> = ref({width: 0, height: 0});
let containerResizeObserver: ResizeObserver | null = null;

const toolList = [t('canvas.tools.select'), t('canvas.tools.move')];
const selectedTool = ref<string>(t('canvas.tools.select'));

const selectedDistributionId = ref<number | null>(null);

const selectedPlantId = ref<number[]>([]);
const unhighlightedDistributionId = ref<number[]>([]);
const plantList = ref<Plant[]>([]);

const requestInfo = ref<RequestInfoData | null>(null);

const canvasOffset: Ref<Offsets> = ref({x: 0, y: 0});

let isMouseDown = false;
let startMousePosition: Position = {x: 0, y: 0};
let startOffset: Offsets = {x: 0, y: 0};

const benchStore = useBenchStore();
const requestDistributionStore = useRequestDistributionStore();
const requestStore = useRequestStore();
const plantStore = usePlantStore();

const route = useRoute();
const greenhouseId = Number(route.params.idCompartiment);

onMounted(async () => {
  addEventListeners();

  await Promise.all([
      benchStore.loadBenches(greenhouseId),
      plantStore.loadPlants()
    ]
  );

  //const requestDistributionIds = benchStore.getRequestDistributionIdsFromBenchesInStore();
  //await requestDistributionStore.loadDistributionByIds(requestDistributionIds);

  await requestDistributionStore.loadDistributions();

  const requestIds = requestDistributionStore.getRequestIdsFromDistributionInStore();
  await requestStore.loadRequestById(requestIds);

  plantList.value = getOnlyPlantShowInCanvas();
});

onBeforeUnmount(() => {
  removeEventListeners();
});

function addEventListeners() {
  containerResizeObserver = CreateContainerResizeObserver(containerRef, containerSize);

  if (!containerRef.value) return
  containerRef.value.addEventListener('mousemove', handleMouseMove);
  containerRef.value.addEventListener('mousedown', handleMouseDown);
  containerRef.value.addEventListener('mouseup', handleMouseUp);
}

function removeEventListeners() {
  if (!containerRef.value) return
  containerRef.value.removeEventListener('mousemove', handleMouseMove);
  containerRef.value.removeEventListener('mousedown', handleMouseDown);
  containerRef.value.removeEventListener('mouseup', handleMouseUp);

  if (containerResizeObserver) {
    containerResizeObserver.disconnect();
  }
}

function handleToolSelect(tool: string) {
  selectedTool.value = tool;

  if (!containerRef.value) return;

  switch (tool) {
    case t('canvas.tools.move'):
      containerRef.value.style.cursor = 'move';
      break;

    default:
      containerRef.value.style.cursor = 'default';
      break;
  }
}

function handlePlantSelect(plantId: number) {
  if (selectedPlantId.value.includes(plantId)) {
    selectedPlantId.value = selectedPlantId.value.filter(id => id !== plantId);
  } else {
    selectedPlantId.value.push(plantId)
  }

  if (!selectedPlantId.value.length) {
    unhighlightedDistributionId.value = [];
    return;
  }

  const plantStageIds = plantStore.getPlantStagesIdsFromPlantIds(selectedPlantId.value)
  unhighlightedDistributionId.value = requestDistributionStore.idsOfDistributionNotAssociatedWithPlantStageList(plantStageIds)
}

function handleMouseMove(event: MouseEvent) {
  switch (selectedTool.value) {
    case t('canvas.tools.move'):
      if (!isMouseDown) return;
      ApplyMouseMoveOnOffset(event, canvasOffset, startMousePosition, startOffset)
      break;

    case t('canvas.tools.select'):
      if (isMouseDown) return;
      CursorPointerWhenOverDistributions(containerRef, event, canvasOffset.value, benchStore, requestDistributionStore);
      break;
  }
}

function handleMouseUp() {
  isMouseDown = false;
}

function handleMouseDown(event: MouseEvent) {
  isMouseDown = true;

  switch (selectedTool.value) {
    case t('canvas.tools.move'):
      startMousePosition = {x: event.clientX, y: event.clientY};
      startOffset = {x: canvasOffset.value.x, y: canvasOffset.value.y};
      break;

    case t('canvas.tools.select'):
      selectedDistributionId.value = DistributionUnderCursor(containerRef, event, canvasOffset.value, benchStore, requestDistributionStore);
      if (!selectedDistributionId.value) {
        requestInfo.value = null;
        return;
      }

      requestInfo.value = GetRequestInfoFromDistribution(selectedDistributionId.value, requestDistributionStore, plantStore, requestStore);
      break;
  }
}

function getOnlyPlantShowInCanvas(): Plant[] {
  const plants: Plant[] = [];

  const distributionIds = new Set<number>()
  benchStore.benches.forEach(bench => {
    bench.request_distribution_ids.forEach(id => distributionIds.add(id))
  })

  const plantIds = new Set<number>();
  for (const distributionId of distributionIds) {
    const distribution = requestDistributionStore.getDistributionById(distributionId);
    if (!distribution) continue;

    const plant = plantStore.getPlantByPlantStageId(distribution.plant_stage_id);
    if (!plant) continue;

    if (plantIds.has(plant.id)) continue;
    plantIds.add(plant.id);
    plants.push(plant);
  }

  return plants;
}
</script>
<style scoped>.container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.canvas-container {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  z-index: 10;
}

.canvas-container > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.tools {
  position: absolute;
  bottom: 15px;
  right: 50%;
  transform: translate(50%, 0%);
  z-index: 100;
}

.box-container {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translate(0, -50%);
  z-index: 100;

  width: 30%;
  max-width: 300px;
  max-height: 80%;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.plant-list-box {
  flex: 1;
  min-height: 100px;
}

.info-box {
  flex-shrink: 0;
}
</style>

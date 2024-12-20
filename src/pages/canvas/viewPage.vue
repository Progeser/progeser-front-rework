<template>
  <v-container class="container" fluid>
    <div ref="containerRef" class="canvas-container">
      <GridComponent
          :offset="canvasOffset"
          :size="containerSize"
          :space="30"
      />
      <BenchesComponent
          :benches="benchStore.benches"
          :display-labels="false"
          :offset="canvasOffset"
          :selected-bench-id="null"
          :size="containerSize"
      />
      <DistributionComponent
          :benches="benchStore.benches"
          :distribution="requestDistributionStore.requestDistributions"
          :offset="canvasOffset"
          :selected-distribution-id="selectedDistributionId"
          :size="containerSize"
          :unhighlighted-ids="unhighlightedDistributionId"
      />
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
          :plant="plantStore.plants"
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
import DistributionComponent from "@/components/canvas/DistributionComponent.vue";
import PlantListComponent from "@/components/canvas/PlantListComponent.vue";
import {BenchStore} from "@/store/BenchStore";
import {RequestDistributionStore} from "@/store/RequestDistribution";
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
import {PlantStore} from "@/store/PlantStore";
import {RequestStore} from "@/store/RequestStore";
import {useRoute} from "vue-router";

const containerRef: Ref<HTMLElement | undefined> = ref();
const containerSize: Ref<Size> = ref({width: 0, height: 0});
let containerResizeObserver: ResizeObserver | null = null;

const toolList = ['Select', 'Move'];
const selectedTool = ref<string>('Select');

const selectedDistributionId = ref<number | null>(null);

const selectedPlantId = ref<number[]>([]);
const unhighlightedDistributionId = ref<number[]>([]);

const requestInfo = ref<RequestInfoData | null>(null);

const canvasOffset: Ref<Offsets> = ref({x: 0, y: 0});

let isMouseDown = false;
let startMousePosition: Position = {x: 0, y: 0};
let startOffset: Offsets = {x: 0, y: 0};

const benchStore = BenchStore();
const requestDistributionStore = RequestDistributionStore();
const requestStore = RequestStore();
const plantStore = PlantStore();

const route = useRoute();
const greenhouseId = Number(route.params.idCompartiment);

onMounted(async () => {
  addEventListeners();

  await Promise.all([
        benchStore.loadBenches(greenhouseId),
        requestDistributionStore.loadDistributions(),
        requestStore.loadRequests(),
        plantStore.loadPlants()
      ]
  );
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
    case 'Move':
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

  const plantStageId = plantStore.plants.filter(p => selectedPlantId.value.includes(p.id)).map(s => s.plant_stages.map(s => s.id)).flat()
  unhighlightedDistributionId.value = requestDistributionStore.requestDistributions.filter(d => !plantStageId.includes(d.plant_stage_id)).map(d => d.id);
}

function handleMouseMove(event: MouseEvent) {
  switch (selectedTool.value) {
    case 'Move':
      if (!isMouseDown) return;
      ApplyMouseMoveOnOffset(event, canvasOffset, startMousePosition, startOffset)
      break;

    case 'Select':
      if (isMouseDown) return;
      CursorPointerWhenOverDistributions(containerRef, event, canvasOffset.value, benchStore.benches, requestDistributionStore.requestDistributions);
      break;
  }
}

function handleMouseUp() {
  isMouseDown = false;
}

function handleMouseDown(event: MouseEvent) {
  isMouseDown = true;

  switch (selectedTool.value) {
    case 'Move':
      startMousePosition = {x: event.clientX, y: event.clientY};
      startOffset = {x: canvasOffset.value.x, y: canvasOffset.value.y};
      break;

    case 'Select':
      selectedDistributionId.value = DistributionUnderCursor(containerRef, event, canvasOffset.value, benchStore.benches, requestDistributionStore.requestDistributions);
      if (!selectedDistributionId.value) {
        requestInfo.value = null;
        return;
      }

      requestInfo.value = GetRequestInfoFromDistribution(selectedDistributionId.value, requestDistributionStore.requestDistributions, plantStore.plants, requestStore.requests);
      break;
  }
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

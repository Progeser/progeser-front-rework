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
      <DistributionsComponent
        :bench-store="benchStore"
        :corner-size="CORNER_SIZE"
        :current-request-id="requestId"
        :display-pots-quantity="true"
        :distribution="requestDistributionStore.requestDistributions"
        :is-editing="selectedTool === t('canvas.tools.edit')"
        :offset="canvasOffset"
        :selected-distribution-id="selectedDistributionId"
        :size="containerSize"
        :unhighlighted-ids="unhighlightedDistributionId"/>
      <SelectorComponent
        :area="selectedArea"
        :pot-quantity="potQuantityInArea"
        :show-m2-labels="false"
        :show-pot-quantity="true"
        :showSizeLabels="false"
        :size="containerSize"/>
    </div>
    <ToolsComponent
      :onToolSelect="handleToolSelect"
      :selected="selectedTool"
      :tools="toolList"
      class="tools"
    />
    <div class="box-container">
      <DistributionToolComponent
        :distribution-store="requestDistributionStore"
        :pots="potStore.pots"
        :request="currentRequest"
        :save="saveDistributions"
        :select-pot="selectPot"
        :update-spacing="updateSpacing"
        class="pot-list"/>
      <DistributionInfoBox
        :distribution-store="requestDistributionStore"
        :remove-distribution="removeDistribution"
        :save-distribution="saveDistribution"
        :selected-distribution-id="selectedDistributionId"
        class="info-box"
      />
    </div>
    <Alert
      :error="errorMessages"
      class="alert"
    />
  </v-container>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, Ref, ref, watch} from "vue";
import GridComponent from "@/components/canvas/GridComponent.vue";
import BenchesComponent from "@/components/canvas/BenchesComponent.vue";
import ToolsComponent from "@/components/canvas/ToolsComponent.vue";
import DistributionsComponent from "@/components/canvas/DistributionsComponent.vue";
import {useBenchStore} from "@/store/BenchStore";
import {useRequestDistributionStore} from "@/store/RequestDistribution";
import {
  ApplyMouseMoveOnDistributionPositions,
  ApplyMouseMoveOnDistributionResize,
  ApplyMouseMoveOnOffset,
  CalculateNumberOfPotsWithSpacing,
  CheckDistributionIsNotOnBench,
  CheckDistributionOverflow,
  Corner,
  CORNER_SIZE,
  CreateContainerResizeObserver,
  CursorPointerWhenOverDistributionCorner,
  CursorPointerWhenOverDistributions,
  Dimension,
  DistributionCornerUnderCursor,
  DistributionUnderCursor,
  GetCursorPositionInContainer,
  GetSelectedArea,
  NewDistributionFromArea,
  NormalizesMetreToUnit,
  Offsets,
  Position,
  Size
} from "@/utils/canvas";
import {usePlantStore} from "@/store/PlantStore";
import {useRequestStore} from "@/store/RequestStore";
import {useRoute} from "vue-router";
import SelectorComponent from "@/components/canvas/SelectorComponent.vue";
import Alert from "@/components/canvas/AlertComponent.vue";
import DistributionInfoBox from "@/components/canvas/DistributionInfoBoxComponent.vue";
import {usePotStore} from "@/store/PotStore";
import {RequestModel} from "@/model/RequestModel";
import DistributionToolComponent from "@/components/canvas/DistributionToolComponent.vue";
import RequestRepository from "@/repository/requestRepository";
import router from "@/router";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const containerRef: Ref<HTMLElement | undefined> = ref();
const containerSize: Ref<Size> = ref({width: 0, height: 0});
let containerResizeObserver: ResizeObserver | null = null;

const toolList = [t('canvas.tools.add'), t('canvas.tools.edit'), t('canvas.tools.move')];
const selectedTool = ref<string>(t('canvas.tools.add'));
const selectedCorner = ref<Corner | null>(null);

let potSpacing = 0
const selectedDistributionId = ref<number | null>(null);
const selectedPot = ref<number | null>(null)
const unhighlightedDistributionId = ref<number[]>([]);
const currentRequest = ref<RequestModel | null>(null);

const canvasOffset: Ref<Offsets> = ref({x: 0, y: 0});

const errorMessages = ref<Error | null>(null);

let isMouseDown = false;
let startMousePosition: Position = {x: 0, y: 0};
let startOffset: Offsets = {x: 0, y: 0};
let startDistributionPosition: Position = {x: 0, y: 0};
let startDistributionDimension: Dimension = {w: 0, h: 0};
let startDistributionBenchId = 0;
let startDistributionPotQuantity = 0;

const selectedArea = ref<[position: Position, dimension: Dimension] | null>(null);
const potQuantityInArea = ref<number>(0);

const benchStore = useBenchStore();
const requestDistributionStore = useRequestDistributionStore();
const requestStore = useRequestStore();
const plantStore = usePlantStore();
const potStore = usePotStore()

const route = useRoute();
const greenhouseId = Number(route.params.idCompartiment);
const requestId = Number(route.params.idRequest);

onMounted(async () => {
  addEventListeners();
  await loadData();
});

onBeforeUnmount(() => {
  removeEventListeners();
});

watch(() => [selectedArea.value], () => {
  if (!selectedArea.value || !selectedPot.value) return;

  const pot = potStore.getPotById(selectedPot.value)
  if (!pot) return;

  const [, dim] = selectedArea.value

  potQuantityInArea.value = CalculateNumberOfPotsWithSpacing(dim, pot.area, potSpacing)
})

async function loadData() {
  await Promise.all([
      benchStore.loadBenches(greenhouseId),
      plantStore.loadPlants(),
      potStore.loadPots()
    ]
  );

  // const requestDistributionIds = benchStore.getRequestDistributionIdsFromBenchesInStore();
  // await requestDistributionStore.loadDistributionByIds(requestDistributionIds);

  await requestDistributionStore.loadDistributions()

  const requestIds = requestDistributionStore.getRequestIdsFromDistributionInStore();
  requestIds.add(requestId);
  await requestStore.loadRequestById(requestIds)

  unhighlightedDistributionId.value = requestDistributionStore.getIdsOfDistributionNotAssociatedWithRequestId(requestId);
  currentRequest.value = requestStore.getRequestById(requestId);
}

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

    case t('canvas.tools.add'):
      containerRef.value.style.cursor = 'crosshair';
      selectedDistributionId.value = null;
      break;

    default:
      containerRef.value.style.cursor = 'default';
      break;
  }
}

function handleMouseMove(event: MouseEvent) {
  switch (selectedTool.value) {
    case t('canvas.tools.move'):
      if (!isMouseDown) return;
      ApplyMouseMoveOnOffset(event, canvasOffset, startMousePosition, startOffset)
      break;

    case t('canvas.tools.add'):
      if (!isMouseDown) return;
      selectedArea.value = GetSelectedArea(containerRef, event, startMousePosition)
      break;

    case t('canvas.tools.edit'):
      if (isMouseDown && selectedDistributionId.value && selectedCorner.value) {
        ApplyMouseMoveOnDistributionResize(event, requestDistributionStore, selectedCorner.value, selectedDistributionId.value, startMousePosition, startDistributionPosition, startDistributionDimension)

        if (!selectedPot.value) return;
        const pot = potStore.getPotById(selectedPot.value);
        if (!pot) return;

        const distribution = requestDistributionStore.getDistributionById(selectedDistributionId.value);
        if (!distribution) return;
        const dim = {w: distribution.dimensions[0], h: distribution.dimensions[1]};

        requestDistributionStore.updateDistributionPotQuantity(selectedDistributionId.value, CalculateNumberOfPotsWithSpacing(dim, pot.area, potSpacing));
        return;
      }

      if (isMouseDown && selectedDistributionId.value && !selectedCorner.value) {
        ApplyMouseMoveOnDistributionPositions(event, benchStore, requestDistributionStore, selectedDistributionId.value, startMousePosition, startDistributionPosition)
        return
      }

      CursorPointerWhenOverDistributions(containerRef, event, canvasOffset.value, benchStore, requestDistributionStore);


      if (!selectedDistributionId.value) return;
      CursorPointerWhenOverDistributionCorner(containerRef, event, canvasOffset.value, benchStore, requestDistributionStore, selectedDistributionId.value, CORNER_SIZE)
      break;
  }
}

function handleMouseUp() {
  isMouseDown = false;

  switch (selectedTool.value) {
    case t('canvas.tools.edit'):
      if (selectedDistributionId.value) {
        if (CheckDistributionIsNotOnBench(selectedDistributionId.value, requestDistributionStore, benchStore)) {
          requestDistributionStore.updateDistributionBenchId(selectedDistributionId.value, startDistributionBenchId)
          requestDistributionStore.updateDistributionPositions(selectedDistributionId.value, startDistributionPosition.x, startDistributionPosition.y)
          if (selectedCorner.value) {
            requestDistributionStore.updateDistributionDimensions(selectedDistributionId.value, startDistributionDimension.w, startDistributionDimension.h)
            requestDistributionStore.updateDistributionPotQuantity(selectedDistributionId.value, startDistributionPotQuantity)
          }
          errorMessages.value = new Error(t('canvas.error.distributionOutside'));
        }

        if (CheckDistributionOverflow(selectedDistributionId.value, requestDistributionStore, benchStore)) {
          requestDistributionStore.updateDistributionBenchId(selectedDistributionId.value, startDistributionBenchId)
          requestDistributionStore.updateDistributionPositions(selectedDistributionId.value, startDistributionPosition.x, startDistributionPosition.y)
          if (selectedCorner.value) {
            requestDistributionStore.updateDistributionDimensions(selectedDistributionId.value, startDistributionDimension.w, startDistributionDimension.h)
            requestDistributionStore.updateDistributionPotQuantity(selectedDistributionId.value, startDistributionPotQuantity)
          }
          errorMessages.value = new Error(t('canvas.error.distributionOverlap'));
        }
      }

      startMousePosition = {x: 0, y: 0};
      startDistributionPosition = {x: 0, y: 0};
      startDistributionDimension = {w: 0, h: 0};
      startDistributionPotQuantity = 0;
      startDistributionBenchId = 0;
      selectedCorner.value = null;
      break;

    case t('canvas.tools.add'):
      if (!selectedArea.value || !selectedPot.value || !currentRequest.value) return

      if (potQuantityInArea.value === 0) {
        errorMessages.value = new Error(t('canvas.error.potQuantityMustGreaterThanZero'))
      } else {
        try {
          selectedDistributionId.value = NewDistributionFromArea(selectedArea.value, currentRequest.value, selectedPot.value, potQuantityInArea.value, benchStore, requestDistributionStore, canvasOffset.value)
        } catch (e) {
          if (e instanceof Error)
            errorMessages.value = e;
        }
      }

      selectedArea.value = null;
      startMousePosition = {x: 0, y: 0};
      break;
  }
}

function handleMouseDown(event: MouseEvent) {
  isMouseDown = true;

  switch (selectedTool.value) {
    case t('canvas.tools.move'):
      startMousePosition = {x: event.clientX, y: event.clientY};
      startOffset = {x: canvasOffset.value.x, y: canvasOffset.value.y};
      break;

    case t('canvas.tools.add'):
      if (!selectedPot.value) {
        isMouseDown = false
        errorMessages.value = new Error(t('canvas.error.unselectPot'));
      } else
        startMousePosition = GetCursorPositionInContainer(containerRef, event);
      break;

    case t('canvas.tools.edit'):
      if (!selectedCorner.value)
        selectedCorner.value = DistributionCornerUnderCursor(containerRef, event, canvasOffset.value, benchStore, requestDistributionStore, selectedDistributionId.value, CORNER_SIZE);

      if (!selectedCorner.value)
        selectedDistributionId.value = DistributionUnderCursor(containerRef, event, canvasOffset.value, benchStore, requestDistributionStore);

      if (selectedDistributionId.value) {
        startMousePosition = {x: event.clientX, y: event.clientY};

        const distribution = requestDistributionStore.getDistributionById(selectedDistributionId.value)
        if (!distribution) return;
        startDistributionPosition = {x: distribution.positions_on_bench[0], y: distribution.positions_on_bench[1]};
        startDistributionBenchId = distribution.bench_id;

        if (selectedCorner.value) {
          startDistributionDimension = {w: distribution.dimensions[0], h: distribution.dimensions[1]};
          startDistributionPotQuantity = distribution.pot_quantity;
        }
      }
      break;
  }
}

function removeDistribution() {
  if (!selectedDistributionId.value) return;

  const distribution = requestDistributionStore.getDistributionById(selectedDistributionId.value);
  if (!distribution) return;

  if (distribution.request_id !== requestId) {
    errorMessages.value = new Error(t('canvas.error.unableToDeleteDistributionIfIsNotAssociatedWithRequest'));
    return;
  }

  requestDistributionStore.removeDistribution(selectedDistributionId.value);
  selectedDistributionId.value = null;
}

function saveDistribution(x: number, y: number, w: number, h: number, potQuantity: number) {
  if (!selectedDistributionId.value) return;

  const distribution = requestDistributionStore.getDistributionById(selectedDistributionId.value);
  if (!distribution) return;

  const [oldX, oldY] = distribution.positions_on_bench;
  const [oldW, oldH] = distribution.dimensions;

  requestDistributionStore.updateDistributionPositions(selectedDistributionId.value, x, y);
  requestDistributionStore.updateDistributionDimensions(selectedDistributionId.value, w, h);

  if (distribution.request_id === requestId) {
    requestDistributionStore.updateDistributionPotQuantity(selectedDistributionId.value, potQuantity);
  }

  if (CheckDistributionIsNotOnBench(selectedDistributionId.value, requestDistributionStore, benchStore)) {
    requestDistributionStore.updateDistributionPositions(selectedDistributionId.value, oldX, oldY);
    requestDistributionStore.updateDistributionDimensions(selectedDistributionId.value, oldW, oldH);
    errorMessages.value = new Error(t('canvas.error.distributionOutside'));
    return;
  }

  if (CheckDistributionOverflow(selectedDistributionId.value, requestDistributionStore, benchStore)) {
    requestDistributionStore.updateDistributionPositions(selectedDistributionId.value, oldX, oldY);
    requestDistributionStore.updateDistributionDimensions(selectedDistributionId.value, oldW, oldH);
    errorMessages.value = new Error(t('canvas.error.distributionOverlap'));
    return;
  }
}

async function saveDistributions() {
  const errors = await requestDistributionStore.save()

  if (errors.length > 0) {
    errorMessages.value = new Error(t('canvas.error.failedToSave'));
    await loadData();
    return;
  }

  RequestRepository.acceptRequest(requestId.toString())
    .then(() => {
      router.push({
        name: 'requestsAccepted',
      })
    })
    .catch(() => {
      errorMessages.value = new Error(t('canvas.error.failedToAccept'));
    });
}

function selectPot(id: number) {
  console.log(id)
  selectedPot.value = id
}

function updateSpacing(value: string) {
  const spacing = NormalizesMetreToUnit(Number(value) / 100)
  potSpacing = Math.round(spacing)
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

.info-box {
  flex: 1;
  min-height: 100px;
}

.pot-list {
  flex-shrink: 0;
}

.alert {
  z-index: 100;
}
</style>

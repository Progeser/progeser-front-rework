<template>
  <v-container class="container" fluid>
    <div ref="containerRef" class="canvas-container">
      <GridComponent
        :offset="canvasOffset"
        :size="containerSize"
        :space="METRE_TO_PIXEL/4"/>
      <BenchesComponent
        :benches="benchStore.benches"
        :corner-size="CORNER_SIZE"
        :display-labels="true"
        :is-editing="selectedTool === t('canvas.tools.edit')"
        :offset="canvasOffset"
        :selected-bench-id="selectedBenchId"
        :size="containerSize"/>
      <SelectorComponent
        :area="selectedArea"
        :pot-quantity="0"
        :show-m2-labels="true"
        :show-pot-quantity="false"
        :showSizeLabels="true"
        :size="containerSize"/>
    </div>
    <ToolsComponent
      :onToolSelect="handleToolSelect"
      :selected="selectedTool"
      :tools="toolList"
      class="tools"/>
    <v-btn class="save-button" color="primary" @click="saveBenches">
      {{ t('canvas.modeling.save') }}
    </v-btn>
    <div class="box-container">
      <BenchInfoBox
        :benchStore="benchStore"
        :remove-bench="removeBench"
        :save-bench="saveBench"
        :selected-bench-id="selectedBenchId"
        class="info-box"/>
    </div>
    <Alert
      :error="errorMessages"
      class="alert"/>
  </v-container>
</template>

<script lang="ts" setup>
import GridComponent from "@/components/canvas/GridComponent.vue";
import {onBeforeUnmount, onMounted, ref, Ref} from "vue";
import {
  ApplyMouseMoveOnBenchPositions,
  ApplyMouseMoveOnBenchResize,
  ApplyMouseMoveOnOffset,
  BenchCornerUnderCursor,
  BenchUnderCursor,
  CheckBenchOverflow,
  Corner,
  CORNER_SIZE,
  CreateContainerResizeObserver,
  CursorPointerWhenOverBench,
  CursorPointerWhenOverBenchCorner,
  Dimension,
  GetCursorPositionInContainer,
  GetSelectedArea,
  METRE_TO_PIXEL,
  NewBenchFromArea,
  Offsets,
  Position,
  Size
} from "@/utils/canvas";
import ToolsComponent from "@/components/canvas/ToolsComponent.vue";
import BenchesComponent from "@/components/canvas/BenchesComponent.vue";
import {useBenchStore} from "@/store/BenchStore";
import {useRoute} from "vue-router";
import SelectorComponent from "@/components/canvas/SelectorComponent.vue";
import BenchInfoBox from "@/components/canvas/BenchInfoBoxComponent.vue";
import Alert from "@/components/canvas/AlertComponent.vue";
import {useI18n} from "vue-i18n";
import router from "@/router";

const {t} = useI18n();

const containerRef: Ref<HTMLElement | undefined> = ref();
const containerSize: Ref<Size> = ref({width: 0, height: 0});
let containerResizeObserver: ResizeObserver | null = null;

const toolList = [t('canvas.tools.add'), t('canvas.tools.edit'), t('canvas.tools.move')];
const selectedTool = ref<string>(t('canvas.tools.edit'));

const selectedBenchId = ref<number | null>(null);
const selectedCorner = ref<Corner | null>(null);

let isMouseDown = false;
let startMousePosition: Position = {x: 0, y: 0};
let startOffset: Offsets = {x: 0, y: 0};
let startBenchPosition: Position = {x: 0, y: 0};
let startBenchDimension: Dimension = {w: 0, h: 0};

const selectedArea = ref<[position: Position, dimension: Dimension] | null>(null);

const canvasOffset: Ref<Offsets> = ref({x: 0, y: 0});

const errorMessages = ref<Error | null>(null);

const benchStore = useBenchStore();

const route = useRoute();
const greenhouseId = Number(route.params.idCompartiment);

onMounted(async () => {
  await loadData();
  addEventListeners();
});

onBeforeUnmount(() => {
  removeEventListeners();
});

async function loadData() {
  await benchStore.loadBenches(greenhouseId)
}

function addEventListeners() {
  containerResizeObserver = CreateContainerResizeObserver(containerRef, containerSize)

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
      selectedBenchId.value = null;
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
      if (isMouseDown && selectedBenchId.value && selectedCorner.value) {
        ApplyMouseMoveOnBenchResize(event, benchStore, selectedCorner.value, selectedBenchId.value, startMousePosition, startBenchPosition, startBenchDimension)
        return;
      }

      if (isMouseDown && selectedBenchId.value && !selectedCorner.value) {
        ApplyMouseMoveOnBenchPositions(event, benchStore, selectedBenchId.value, startMousePosition, startBenchPosition)
        return;
      }

      CursorPointerWhenOverBench(containerRef, event, canvasOffset.value, benchStore);

      if (!selectedBenchId.value) return;
      CursorPointerWhenOverBenchCorner(containerRef, event, canvasOffset.value, benchStore, selectedBenchId.value, CORNER_SIZE)
      break;
  }
}

function handleMouseUp() {
  isMouseDown = false;

  switch (selectedTool.value) {
    case t('canvas.tools.edit'):
      if (selectedBenchId.value && CheckBenchOverflow(selectedBenchId.value, benchStore)) {
        benchStore.updateBenchPositions(selectedBenchId.value, startBenchPosition.x, startBenchPosition.y)

        if (selectedCorner.value)
          benchStore.updateBenchDimensions(selectedBenchId.value, startBenchDimension.w, startBenchDimension.h)

        errorMessages.value = new Error(t("canvas.error.benchOverlap"));
      }

      selectedCorner.value = null;
      startMousePosition = {x: 0, y: 0};
      startBenchPosition = {x: 0, y: 0};
      startBenchDimension = {w: 0, h: 0};
      break;

    case t('canvas.tools.add'):
      if (!selectedArea.value) return
      try {
        selectedBenchId.value = NewBenchFromArea(selectedArea.value, benchStore, greenhouseId, canvasOffset.value)
      } catch (e) {
        if (e instanceof Error)
          errorMessages.value = e;
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

    case t('canvas.tools.edit'):
      if (selectedBenchId.value)
        selectedCorner.value = BenchCornerUnderCursor(containerRef, event, canvasOffset.value, benchStore, selectedBenchId.value, CORNER_SIZE);

      if (!selectedCorner.value)
        selectedBenchId.value = BenchUnderCursor(containerRef, event, canvasOffset.value, benchStore);

      if (selectedBenchId.value) {
        const bench = benchStore.getBenchById(selectedBenchId.value);
        if (!bench) return;

        startMousePosition = {x: event.clientX, y: event.clientY};
        startBenchPosition = {x: bench.positions[0], y: bench.positions[1]}

        if (selectedCorner.value)
          startBenchDimension = {w: bench.dimensions[0], h: bench.dimensions[1]}
      }
      break;

    case t('canvas.tools.add'):
      startMousePosition = GetCursorPositionInContainer(containerRef, event);
      break;
  }
}

async function saveBenches() {
  const errors = await benchStore.save();

  if (errors.length > 0) {
    errorMessages.value = new Error(t("canvas.error.failedToSave"));
    await loadData();
  } else {
    router.push({
      name: 'compartiments',
    })
  }
}

async function saveBench(name: string, x: number, y: number, w: number, h: number) {
  if (!selectedBenchId.value) return;

  const bench = benchStore.getBenchById(selectedBenchId.value);
  if (!bench) return;

  const [oldX, oldY] = bench.positions;
  const [oldW, oldH] = bench.dimensions;

  benchStore.updateBenchName(selectedBenchId.value, name);
  benchStore.updateBenchPositions(selectedBenchId.value, x, y);
  benchStore.updateBenchDimensions(selectedBenchId.value, w, h);

  if (CheckBenchOverflow(selectedBenchId.value, benchStore)) {
    benchStore.updateBenchPositions(selectedBenchId.value, oldX, oldY);
    benchStore.updateBenchDimensions(selectedBenchId.value, oldW, oldH);
    errorMessages.value = new Error(t("canvas.error.benchOverlap"));
  }
}

function removeBench() {
  if (!selectedBenchId.value) return;

  benchStore.removeBench(selectedBenchId.value);
  selectedBenchId.value = null;
}
</script>

<style scoped>
.container {
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

.save-button {
  position: absolute;
  bottom: 15px;
  right: 15px;
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

.alert {
  z-index: 100;
}
</style>

<template>
  <v-container class="container" fluid>
    <div ref="containerRef" class="canvas-container">
      <GridComponent
        :offset="canvasOffset"
        :size="containerSize"
        :space="METRE_TO_PIXEL/4"
      />
      <BenchesComponent
        :benches="benchStore.benches"
        :corner-size="BENCH_CORNER_SIZE"
        :display-labels="true"
        :is-editing="true"
        :offset="canvasOffset"
        :selected-bench-id="selectedBenchId"
        :size="containerSize"
      />
    </div>
    <ToolsComponent
      :onToolSelect="handleToolSelect"
      :selected="selectedTool"
      :tools="toolList"
      class="tools"
    />
  </v-container>
</template>

<script lang="ts" setup>
import GridComponent from "@/components/canvas/GridComponent.vue";
import {onBeforeUnmount, onMounted, ref, Ref} from "vue";
import {
  ApplyMouseMoveOnBenchPositions,
  ApplyMouseMoveOnBenchResize,
  ApplyMouseMoveOnOffset,
  BENCH_CORNER_SIZE,
  BenchCornerUnderCursor,
  BenchUnderCursor,
  CheckOverflow,
  Corner,
  CreateContainerResizeObserver,
  CursorPointerWhenOverBench,
  CursorPointerWhenOverBenchCorner,
  Dimension,
  METRE_TO_PIXEL,
  Offsets,
  Position,
  Size
} from "@/utils/canvas";
import ToolsComponent from "@/components/canvas/ToolsComponent.vue";
import BenchesComponent from "@/components/canvas/BenchesComponent.vue";
import {useBenchStore} from "@/store/BenchStore";
import {useRoute} from "vue-router";

const containerRef: Ref<HTMLElement | undefined> = ref();
const containerSize: Ref<Size> = ref({width: 0, height: 0});
let containerResizeObserver: ResizeObserver | null = null;

const toolList = ['Select', 'Add', 'Move'];
const selectedTool = ref<string>('Select');

const selectedBenchId = ref<number | null>(null);
const selectedCorner = ref<Corner | null>(null);


let isMouseDown = false;
let startMousePosition: Position = {x: 0, y: 0};
let startOffset: Offsets = {x: 0, y: 0};
let startBenchPosition: Position = {x: 0, y: 0};
let startBenchDimension: Dimension = {w: 0, h: 0};

const canvasOffset: Ref<Offsets> = ref({x: 0, y: 0});

const benchStore = useBenchStore();

const route = useRoute();
const greenhouseId = Number(route.params.idCompartiment);

onMounted(async () => {
  await benchStore.loadBenches(greenhouseId)
  addEventListeners();
});

onBeforeUnmount(() => {
  removeEventListeners();
});

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
    case 'Move':
      containerRef.value.style.cursor = 'move';
      break;

    case 'Add':
      containerRef.value.style.cursor = 'crosshair';
      break;

    default:
      containerRef.value.style.cursor = 'default';
      break;
  }
}

function handleMouseMove(event: MouseEvent) {
  switch (selectedTool.value) {
    case 'Move':
      if (!isMouseDown) return;
      ApplyMouseMoveOnOffset(event, canvasOffset, startMousePosition, startOffset)
      break;

    case 'Select':
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
      CursorPointerWhenOverBenchCorner(containerRef, event, canvasOffset.value, benchStore, selectedBenchId.value, BENCH_CORNER_SIZE)
      break;
  }
}

function handleMouseUp() {
  isMouseDown = false;

  if (selectedBenchId.value && CheckOverflow(selectedBenchId.value, benchStore)) {
    benchStore.updateBenchPositions(selectedBenchId.value, startBenchPosition.x, startBenchPosition.y)

    if (selectedCorner.value)
      benchStore.updateBenchDimensions(selectedBenchId.value, startBenchDimension.w, startBenchDimension.h)
  }

  selectedCorner.value = null;
}

function handleMouseDown(event: MouseEvent) {
  isMouseDown = true;

  switch (selectedTool.value) {
    case 'Move':
      startMousePosition = {x: event.clientX, y: event.clientY};
      startOffset = {x: canvasOffset.value.x, y: canvasOffset.value.y};
      break;

    case 'Select':
      if (selectedBenchId.value)
        selectedCorner.value = BenchCornerUnderCursor(containerRef, event, canvasOffset.value, benchStore, selectedBenchId.value, BENCH_CORNER_SIZE);

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
  }
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
</style>

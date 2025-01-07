<template>
  <v-container class="canvas-container" fluid>
    <canvas ref="canvasRef"></canvas>
  </v-container>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref, watch} from "vue";
import {Offsets, ResizeCanvas, SetupCanvas, Size} from "@/utils/canvas";
import {BenchStore} from "@/store/BenchStore";

const canvasRef: Ref<HTMLCanvasElement | undefined> = ref();
const canvasContext: Ref<CanvasRenderingContext2D | undefined> = ref();

const props = defineProps<{
  size: Size;
  offset: Offsets;
  benchStore: BenchStore;
  currentRequestId: number | null;
  distribution: RequestDistribution[];
  selectedDistributionId: number | null;
  isEditing: boolean;
  cornerSize: number;
  displayPotsQuantity: boolean;
  unhighlightedIds: number[];
}>();

watch(() => [props.size], () => {
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas();
});

watch(() => [props.offset], () => {
  renderCanvas();
});

watch(() => [props.benchStore.benches, props.distribution], () => {
  renderCanvas();
})

watch(() => [props.selectedDistributionId, props.unhighlightedIds], () => {
  renderCanvas();
})

watch(() => [props.isEditing], () => {
  renderCanvas();
})

onMounted(async () => {
  SetupCanvas(canvasRef, canvasContext);
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas();
})

function renderCanvas() {
  if (!canvasContext.value || !canvasRef.value) return;

  const {width, height} = canvasRef.value;
  canvasContext.value.reset();
  canvasContext.value.clearRect(0, 0, width, height)
  canvasContext.value.translate(props.offset.x, props.offset.y);

  props.distribution?.forEach(distribution => {
    drawDistribution(distribution)
    const bench = props.benchStore.getBenchById(distribution.bench_id)
    if (!bench) return;
    props.displayPotsQuantity && drawLabel(bench, distribution)
    if (!props.isEditing) return;
    props.isEditing &&
    props.selectedDistributionId == distribution.id &&
    props.currentRequestId == distribution.request_id &&
    drawResize(bench, distribution)
  })
}

function drawDistribution(distribution: RequestDistribution) {
  if (!canvasContext.value) return;

  const benchOfDistribution = props.benchStore.getBenchById(distribution.bench_id);
  if (!benchOfDistribution) return;

  const [x, y] = calGlobalPositionOfDistribution(distribution, benchOfDistribution)
  const [w, h] = distribution.dimensions

  const isUnhighlighted = props.unhighlightedIds.includes(distribution.id);

  canvasContext.value.save()
  canvasContext.value.globalAlpha = isUnhighlighted ? 0.2 : 1;
  canvasContext.value.fillStyle = 'rgb(157,154,230)';
  canvasContext.value.fillRect(x, y, w, h);
  canvasContext.value.lineWidth = 1.5;
  canvasContext.value.strokeStyle = props.selectedDistributionId == distribution.id ? 'rgb(253,216,53)' : 'rgb(0,0,0)';
  canvasContext.value.strokeRect(x, y, w, h);
  canvasContext.value.restore();
}

function drawLabel(bench: Bench, distribution: RequestDistribution) {
  if (!canvasContext.value) return;

  const centerX = (bench.positions[0] + distribution.positions_on_bench[0]) + (distribution.dimensions[0] / 2);
  const centerY = (bench.positions[1] + distribution.positions_on_bench[1]) + (distribution.dimensions[1] / 2);

  canvasContext.value.save()
  canvasContext.value.textAlign = 'center';
  canvasContext.value.textBaseline = 'middle';
  canvasContext.value.fillStyle = 'black';
  canvasContext.value.font = 'bold 12px Arial';
  canvasContext.value.fillText(distribution.pot_quantity.toString(), centerX, centerY);
  canvasContext.value.restore();
}

function calGlobalPositionOfDistribution(distribution: RequestDistribution, bench: Bench) {
  const [bx, by] = bench.positions
  const [dx, dy] = distribution.positions_on_bench

  return [bx + dx, by + dy]
}

function drawResize(benchOfDistribution: Bench, distribution: RequestDistribution) {
  if (!canvasContext.value) return;

  const [x, y] = calGlobalPositionOfDistribution(distribution, benchOfDistribution)
  const [w, h] = distribution.dimensions
  const cornerSize = props.cornerSize;

  canvasContext.value.save();
  canvasContext.value.fillStyle = "rgb(253,216,53)";

  // Upper left corner
  canvasContext.value.fillRect(x - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
  // Upper right corner
  canvasContext.value.fillRect(x + w - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
  // Lower left corner
  canvasContext.value.fillRect(x - cornerSize / 2, y + h - cornerSize / 2, cornerSize, cornerSize);
  // Lower right corner
  canvasContext.value.fillRect(x + w - cornerSize / 2, y + h - cornerSize / 2, cornerSize, cornerSize);

  canvasContext.value.restore();
}
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;
}
</style>

<template>
  <v-container class="canvas-container" fluid>
    <canvas ref="canvasRef"></canvas>
  </v-container>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref, watch} from "vue";
import {Offsets, ResizeCanvas, SetupCanvas, Size} from "@/utils/canvas";

const canvasRef: Ref<HTMLCanvasElement | undefined> = ref();
const canvasContext: Ref<CanvasRenderingContext2D | undefined> = ref();

const props = defineProps<{
  size: Size;
  offset: Offsets;
  benches: Bench[];
  distribution: RequestDistribution[];
  selectedDistributionId: number | null;
  unhighlightedIds: number[];
}>();

watch(() => [props.size], () => {
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas();
});

watch(() => [props.offset], () => {
  renderCanvas();
});

watch(() => [props.benches, props.distribution], () => {
  renderCanvas();
})

watch(() => [props.selectedDistributionId, props.unhighlightedIds], () => {
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
  })
}

function drawDistribution(distribution: RequestDistribution) {
  if (!canvasContext.value) return;

  const benchOfDistribution = props.benches.find(b => b.id === distribution.bench_id)
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

function calGlobalPositionOfDistribution(distribution: RequestDistribution, bench: Bench) {
  const [bx, by] = bench.positions
  const [dx, dy] = distribution.positions_on_bench

  return [bx + dx, by + dy]
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

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
  selectedBenchId: number | null;
  displayLabels: boolean;
}>();

watch(() => [props.size], () => {
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas();
});

watch(() => [props.offset], () => {
  renderCanvas();
});

watch(() => [props.benches], () => {
  renderCanvas();
})

watch(() => [props.selectedBenchId], () => {
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
  canvasContext.value.clearRect(0, 0, width, height);
  canvasContext.value.translate(props.offset.x, props.offset.y);

  props.benches?.forEach(bench => {
    drawBench(bench)
    props.displayLabels && drawLabels(bench)
  })
}

function drawBench(bench: Bench) {
  if (!canvasContext.value) return;

  const [x, y] = bench.positions
  const [w, h] = bench.dimensions

  canvasContext.value.save()
  canvasContext.value.fillStyle = 'white';
  canvasContext.value.fillRect(x, y, w, h);
  canvasContext.value.lineWidth = 1.5;
  canvasContext.value.strokeStyle = props.selectedBenchId == bench.id ? 'rgb(253,216,53)' : 'rgb(0,0,0)';
  canvasContext.value.strokeRect(x, y, w, h);
  canvasContext.value.restore();
}

function drawLabels(bench: Bench) {
  if (!canvasContext.value) return;

  const centerX = bench.positions[0] + bench.dimensions[0] / 2;
  const centerY = bench.positions[1] + bench.dimensions[1] / 2;

  canvasContext.value.save()
  canvasContext.value.textAlign = 'center';
  canvasContext.value.textBaseline = 'middle';
  canvasContext.value.fillText(bench.name, centerX, centerY);
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

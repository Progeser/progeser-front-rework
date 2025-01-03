<template>
  <v-container class="canvas-container" fluid>
    <canvas ref="canvasRef"></canvas>
  </v-container>
</template>

<script lang="ts" setup>
import {onMounted, ref, Ref, watch} from "vue";
import {NormalizesUnitToMetre, Offsets, ResizeCanvas, SetupCanvas, Size} from "@/utils/canvas";

const canvasRef: Ref<HTMLCanvasElement | undefined> = ref();
const canvasContext: Ref<CanvasRenderingContext2D | undefined> = ref();

const props = defineProps<{
  size: Size;
  offset: Offsets;
  benches: Bench[];
  selectedBenchId: number | null;
  isEditing: boolean;
  cornerSize: number;
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
    props.isEditing && props.selectedBenchId == bench.id && drawResize(bench)
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

  const widthInMeter = NormalizesUnitToMetre(bench.dimensions[0]).toString() + "m";
  const heightInMeter = NormalizesUnitToMetre(bench.dimensions[1]).toString() + "m";

  const labels = [
    {text: bench.name, x: centerX, y: centerY},
    {text: widthInMeter, x: centerX, y: bench.positions[1]},
    {text: heightInMeter, x: bench.positions[0], y: centerY}
  ];

  canvasContext.value.save()
  canvasContext.value.textAlign = 'center';
  canvasContext.value.textBaseline = 'middle';

  labels.forEach(label => {
    if (!canvasContext.value) return;

    const textMetrics = canvasContext.value.measureText(label.text);
    const textWidth = textMetrics.width;
    const textHeight = 16;

    canvasContext.value.fillStyle = 'white';
    canvasContext.value.fillRect(
      label.x - textWidth / 2 - 8,
      label.y - textHeight / 2 - 4,
      textWidth + 16,
      textHeight + 8
    );

    canvasContext.value.fillStyle = 'black';
    canvasContext.value.fillText(label.text, label.x, label.y);
  });

  canvasContext.value.restore();
}


function drawResize(bench: Bench) {
  if (!canvasContext.value) return;

  const [x, y] = bench.positions
  const [w, h] = bench.dimensions
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

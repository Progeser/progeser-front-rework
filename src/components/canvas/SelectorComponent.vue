<template>
  <v-container class="canvas-container" fluid>
    <canvas ref="canvasRef"></canvas>
  </v-container>
</template>

<script lang="ts" setup>
import {Dimension, NormalizesUnitToMetre, Position, ResizeCanvas, SetupCanvas, Size} from "@/utils/canvas";
import {onMounted, ref, Ref, watch} from "vue";

const canvasRef: Ref<HTMLCanvasElement | undefined> = ref();
const canvasContext: Ref<CanvasRenderingContext2D | undefined> = ref();

const props = defineProps<{
  size: Size;
  showSizeLabels: boolean;
  showM2Labels: boolean;
  area: [position: Position, dimension: Dimension] | null
}>();


watch(() => [props.size], () => {
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas();
});

watch(() => [props.area], () => {
  renderCanvas();
});

onMounted(async () => {
  SetupCanvas(canvasRef, canvasContext);
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas()
})

function renderCanvas() {
  if (!canvasContext.value || !canvasRef.value) return;

  const {width, height} = canvasRef.value;
  canvasContext.value.reset();
  canvasContext.value.clearRect(0, 0, width, height);

  if (!props.area) return;
  drawSelector(props.area)
  props.showSizeLabels && drawSizeLabels(props.area)
  props.showM2Labels && drawM2Labels(props.area)
}

function drawSelector(area: [position: Position, dimension: Dimension]) {
  if (!canvasContext.value) return;

  const [position, dimension] = area

  canvasContext.value.save()
  canvasContext.value.setLineDash([4, 2]);
  canvasContext.value.strokeRect(position.x, position.y, dimension.w, dimension.h);
  canvasContext.value.restore();
}

function drawSizeLabels(area: [position: Position, dimension: Dimension]) {
  if (!canvasContext.value) return;

  const [position, dimension] = area

  const centerX = position.x + dimension.w / 2;
  const centerY = position.y + dimension.h / 2;

  const widthInMeter = NormalizesUnitToMetre(dimension.w).toString() + "m";
  const heightInMeter = NormalizesUnitToMetre(dimension.h).toString() + "m";

  const labels = [
    {text: widthInMeter, x: centerX, y: position.y},
    {text: heightInMeter, x: position.x, y: centerY}
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

function drawM2Labels(area: [position: Position, dimension: Dimension]) {
  if (!canvasContext.value) return;

  const [position, dimension] = area

  const centerX = position.x + dimension.w / 2;
  const centerY = position.y + dimension.h / 2;

  const widthInMeter = NormalizesUnitToMetre(dimension.w);
  const heightInMeter = NormalizesUnitToMetre(dimension.h);
  const m2 = (widthInMeter * heightInMeter)
  const message = m2.toFixed(2) + "m2"

  canvasContext.value.save()
  canvasContext.value.textAlign = 'center';
  canvasContext.value.textBaseline = 'middle';
  canvasContext.value.fillStyle = 'black';
  canvasContext.value.fillText(message, centerX, centerY);
  canvasContext.value.restore();
}

</script>

<style scoped>

</style>

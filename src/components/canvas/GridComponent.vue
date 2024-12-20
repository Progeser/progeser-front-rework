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
  space: number;
}>();

watch(() => [props.size], () => {
  ResizeCanvas(canvasRef, props.size.width, props.size.height);
  renderCanvas();
});

watch(() => [props.offset], () => {
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
  canvasContext.value.translate(props.offset.x, props.offset.y);

  const endX = props.size.width + Math.abs(props.offset.x);
  const endY = props.size.height + Math.abs(props.offset.y);

  for (let x = props.space; x < endX; x += props.space) {
    for (let y = props.space; y < endY; y += props.space) {
      drawCircle(x, y, 1);
    }
  }
}

function drawCircle(x: number, y: number, r: number) {
  if (!canvasContext.value) return;

  canvasContext.value.save()
  canvasContext.value.beginPath();
  canvasContext.value.arc(x, y, r, 0, Math.PI * 2);
  canvasContext.value.fillStyle = 'rgba(55,71,79,0.5)';
  canvasContext.value.fill();
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

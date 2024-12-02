<template>
  <v-container class="canvas-container" fluid>
    <canvas ref="canvasRef"></canvas>
    <v-form
      v-if="benchStore.selectedBench"
      class="form-container"
      @submit.prevent="updateBenchInfo"
    >
      <v-text-field
        v-model.number="formData.name"
        label="Nom"
        required
        type="text"
      />
      <v-text-field
        v-model.number="formData.width"
        label="Largeur"
        required
        type="number"
      />
      <v-text-field
        v-model.number="formData.height"
        label="Hauteur"
        required
        type="number"
      />
      <v-btn class="form-btn mb-2" color="error" @click="removeBench">Supprimer</v-btn>
      <v-btn class="form-btn" color="primary" type="submit">Mettre à jour</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, Ref, watch} from 'vue';
import {useBenchStore} from "@/store/BenchStore";

const canvasRef: Ref<HTMLCanvasElement | undefined> = ref();
const canvasContext: Ref<CanvasRenderingContext2D | undefined> = ref();
const formData = ref({width: 0, height: 0, name: ''});

const benchStore = useBenchStore();

let clickIsMaintained = false;
let clickOnX = 0;
let clickOnY = 0;
let animationFrameId: number | null = null;

const props = defineProps({
  idCompartiment: Number,
})

// Watchers
watch(
  () => benchStore.benches,
  renderCanvas,
  {immediate: true}
);

watch(
  () => benchStore.selectedBench,
  renderCanvas,
  {immediate: true}
);

// Lifecycle hooks
onMounted(async () => {

  window.addEventListener('resize', resizeCanvas);

  if (!canvasRef.value) return
  canvasContext.value = canvasRef.value.getContext('2d') || undefined;

  canvasRef.value.addEventListener('mousemove', handleMouseOverBench);
  canvasRef.value.addEventListener('mousedown', handleMouseDown);
  canvasRef.value.addEventListener('mouseup', handleMouseUp);
  canvasRef.value.addEventListener('mousemove', handleMouseMove);

  resizeCanvas();
  await benchStore.loadBenches(props.idCompartiment!);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);

  if (!canvasRef.value) return
  canvasRef.value.removeEventListener('mousemove', handleMouseOverBench);
  canvasRef.value.removeEventListener('mousedown', handleMouseDown);
  canvasRef.value.removeEventListener('mouseup', handleMouseUp);
  canvasRef.value.removeEventListener('mousemove', handleMouseMove);
});

// Functions
function resizeCanvas() {
  if (canvasRef.value) {
    const container = canvasRef.value.parentElement;
    if (container) {
      canvasRef.value.width = container.clientWidth;
      canvasRef.value.height = container.clientHeight;
    }
    renderCanvas();
  }
}

function renderCanvas() {
  if (!canvasContext.value || !canvasRef.value) return;

  const {width, height} = canvasRef.value;
  canvasContext.value.reset();
  canvasContext.value.clearRect(0, 0, width, height);

  benchStore.benches.forEach((bench : Bench) => {
    if (!canvasContext.value) return;

    if (benchStore.selectedBench && bench.id === benchStore.selectedBench.id) {
      bench = benchStore.selectedBench;
    }

    const centerX = bench.positions[0] + bench.dimensions[0] / 2;
    const centerY = bench.positions[1] + bench.dimensions[1] / 2;

    canvasContext.value.textAlign = 'center';
    canvasContext.value.textBaseline = 'middle';
    canvasContext.value.fillText(bench.name, centerX, centerY);

    canvasContext.value.strokeStyle =
      benchStore.selectedBench && bench.id === benchStore.selectedBench.id
        ? 'red'
        : 'black';
    canvasContext.value.strokeRect(
      bench.positions[0],
      bench.positions[1],
      bench.dimensions[0],
      bench.dimensions[1]
    );
  });
}

function handleMouseOverBench(event: MouseEvent) {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  let cursor = 'default';

  for (const bench of benchStore.benches) {
    if (
      mouseX >= bench.positions[0] &&
      mouseX <= bench.positions[0] + bench.dimensions[0] &&
      mouseY >= bench.positions[1] &&
      mouseY <= bench.positions[1] + bench.dimensions[1]
    ) {
      cursor = 'pointer';
      break;
    }
  }

  canvasRef.value.style.cursor = cursor;
}

function handleMouseDown(event: MouseEvent) {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  let isOverBench = false;

  for (const bench of benchStore.benches) {
    if (
      mouseX >= bench.positions[0] &&
      mouseX <= bench.positions[0] + bench.dimensions[0] &&
      mouseY >= bench.positions[1] &&
      mouseY <= bench.positions[1] + bench.dimensions[1]
    ) {
      benchStore.selectBench(bench);
      formData.value = {
        name: bench.name,
        width: bench.dimensions[0],
        height: bench.dimensions[1]
      };

      isOverBench = true;
      clickOnX = mouseX - bench.positions[0];
      clickOnY = mouseY - bench.positions[1];
      break;
    }
  }

  if (!isOverBench) {
    benchStore.selectBench(null);
    clickOnX = mouseX;
    clickOnY = mouseY;
  }

  clickIsMaintained = true;
}

async function createNewBench(event: MouseEvent) {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const newWidth = Math.abs(mouseX - clickOnX);
  const newHeight = Math.abs(mouseY - clickOnY);

  if (newWidth < 10 || newHeight < 10) return;

  const bench = {
    name: 'New Bench',
    dimensions: [newWidth, newHeight],
    positions: [(mouseX > clickOnX) ? clickOnX : mouseX, (mouseY > clickOnY) ? clickOnY : mouseY],
  };

  await benchStore
    .addBench(props.idCompartiment!, bench)
    .then(() => {
      if (benchStore.selectedBench === null) return;

      formData.value = {
        name: benchStore.selectedBench.name,
        width: benchStore.selectedBench.dimensions[0],
        height: benchStore.selectedBench.dimensions[1]
      };
    })
    .catch(renderCanvas);
}

function handleMouseUp(event: MouseEvent) {
  clickIsMaintained = false;

  if (benchStore.selectedBench) {
    benchStore.updateBench(benchStore.selectedBench);
  } else {
    createNewBench(event);
  }
}

function DragBench(event: MouseEvent) {
  if (!benchStore.selectedBench || !canvasRef.value) return;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    if (!canvasRef.value || !benchStore.selectedBench) return;

    const rect = canvasRef.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const newPosX = mouseX - clickOnX;
    const newPosY = mouseY - clickOnY;

    benchStore.updateSelectedBenchPositions([newPosX, newPosY]);
    animationFrameId = null;
  });
}

function DrawNewBenchSelectionArea(event: MouseEvent) {
  if (!canvasContext.value || !canvasRef.value) return;

  renderCanvas();

  const rect = canvasRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const newWidth = mouseX - clickOnX;
  const newHeight = mouseY - clickOnY;

  canvasContext.value.setLineDash([4, 2]);
  canvasContext.value.strokeRect(clickOnX, clickOnY, newWidth, newHeight);
}

function handleMouseMove(event: MouseEvent) {
  if (!clickIsMaintained) return;

  if (benchStore.selectedBench) {
    DragBench(event);
  } else {
    DrawNewBenchSelectionArea(event);
  }
}

function updateBenchInfo() {
  if (!benchStore.selectedBench) return;

  const {id, positions} = benchStore.selectedBench;
  const {width, height} = formData.value;

  const isOverlapping = benchStore.benches.some((bench : Bench) =>
    bench.id !== id &&
    positions[0] < bench.positions[0] + bench.dimensions[0] &&
    positions[0] + width > bench.positions[0] &&
    positions[1] < bench.positions[1] + bench.dimensions[1] &&
    positions[1] + height > bench.positions[1]
  );

  if (isOverlapping) {
    alert('Bench is overlapping');
    return;
  }

  benchStore.updateSelectedBenchName(formData.value.name);
  benchStore.updateSelectedBenchDimensions([
    formData.value.width,
    formData.value.height
  ]);

  benchStore.updateBench(benchStore.selectedBench);
}

function removeBench() {
  if (!benchStore.selectedBench) return

  benchStore.deleteBench(benchStore.selectedBench.id);
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.form-container {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translate(0%, -50%);
  width: 200px;
  padding: 16px;
  background: #f9f9f9;
}

.form-btn {
  width: 100%;
}
</style>

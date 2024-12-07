<template>
  <v-container class="canvas-container" fluid>
    <canvas ref="canvasRef"></canvas>

    <div class="container">
      <div class="pot-selector-container">
        <v-autocomplete
          v-model="formSelectedPot"
          :items="potStore.pots"
          clearable
          item-title="name"
          item-value="id"
          label="Select a Pot"
          @update:modelValue="updateSelectedPot"
        ></v-autocomplete>

        <v-text-field
          v-model.number="formSpace"
          :rules="[value => value >= 0 || 'L\'espacement doit être non négatif']"
          label="Espacement"
          min="0"
          placeholder="Enter l'espacement"
          type="number"
        ></v-text-field>
      </div>

      <div v-if="requestDistribution && request" class="request-distribution-container">
        <p>{{ requestDistribution ? request.plant_name : "" }}</p>
        <p>{{ request.quantity - requestDistribution.seeds_left_to_plant }} / {{ request.quantity }}</p>
      </div>
      <div v-else class="request-distribution-container">
        <p>Logging...</p>
      </div>

      <div class="distribution-container">
        <v-list-item v-for="(item, i) in formDistributions"
                     :key="i"
        >
          <div class="distribution-item">
            <div class="distribution-position">
              <p class="bench-name">{{ truncateText(item.bench_name, 20) }}</p>
              <p class="greenhouse-name">{{ truncateText(item.greenhouse_name, 20) }}</p>
            </div>
            <p>{{ item.quantity }}</p>
          </div>
        </v-list-item>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, Ref, watch} from 'vue';
import {useRequestDistribution} from "@/store/useRequestDistribution";
import {useRequest} from "@/store/useRequest";
import {useRoute} from "vue-router";
import {useBenchStore} from "@/store/useBenchStore";
import {useDistribution} from "@/store/useDistribution";
import {usePot} from "@/store/usePot";
import {useGreenhouse} from "@/store/useGreenhouse";

const canvasRef: Ref<HTMLCanvasElement | undefined> = ref();
const canvasContext: Ref<CanvasRenderingContext2D | undefined> = ref();
const requestDistribution: Ref<RequestDistribution | null> = ref(null)
const request: Ref<Request | null> = ref(null)

const requestDistributionStore = useRequestDistribution();
const requestStore = useRequest();
const benchStore = useBenchStore();
const distributionStore = useDistribution();
const potStore = usePot()
const greenhouseStore = useGreenhouse();

const route = useRoute();
const requestDistributionId = Number(route.params.requestDistributionId);
const buildingId = Number(route.params.buildingId);
const greenhouseId = Number(route.params.greenhouseId);

let clickIsMaintained = false;
let clickIsOnBench: null | Bench = null;
let clickOnX = 0;
let clickOnY = 0;
let animationFrameId: number | null = null;

const formSelectedPot = ref<number | null>(null);
const formSpace = ref<number>(0);
const formDistributions = ref<{ bench_name: string, greenhouse_name: string, quantity: number }[]>([]);

watch(
  () => benchStore.benches,
  renderCanvas,
  {immediate: true}
);

watch(
  () => distributionStore.distributions,
  renderCanvas,
  {immediate: true}
);

watch(
  () => distributionStore.selectedDistribution,
  renderCanvas,
  {immediate: true}
);


// Lifecycle hooks
onMounted(async () => {
  window.addEventListener('resize', resizeCanvas);

  if (!canvasRef.value) return
  canvasContext.value = canvasRef.value.getContext('2d') || undefined;
  canvasRef.value.addEventListener('mousemove', handleMouseOverDistributions);
  canvasRef.value.addEventListener('mousedown', handleMouseDown);
  canvasRef.value.addEventListener('mouseup', handleMouseUp);
  canvasRef.value.addEventListener('mousemove', handleMouseMove);

  resizeCanvas();
  await Promise.all([
    requestDistributionStore.loadRequestDistributions(),
    requestStore.loadRequests(),
    benchStore.loadBenches(greenhouseId),
    distributionStore.loadDistributions(greenhouseId),
    potStore.loadPots(),
    greenhouseStore.loadGreenhouse(buildingId)
  ]);

  requestDistribution.value = requestDistributionStore.getRequestDistributionById(requestDistributionId);
  request.value = requestStore.getRequestById(requestDistribution.value!.request_id);

  updateFormDistributions();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);

  if (!canvasRef.value) return
  canvasRef.value.removeEventListener('mousemove', handleMouseOverDistributions);
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

  benchStore.benches.forEach((bench) => {
    if (!canvasContext.value) return;

    canvasContext.value.strokeRect(
      bench.positions[0],
      bench.positions[1],
      bench.dimensions[0],
      bench.dimensions[1]
    );

    distributionStore.getDistributionByBenchId(bench.id)?.forEach((distribution) => {
      if (!canvasContext.value) return;

      if (distributionStore.selectedDistribution && distribution.id === distributionStore.selectedDistribution.id) {
        distribution = distributionStore.selectedDistribution;
      }

      canvasContext.value.save()
      canvasContext.value.lineWidth = 2;

      if (distribution.request_distribution_id != requestDistributionId) {
        canvasContext.value.fillStyle = 'rgba(244,67,54,0.50)'
        canvasContext.value.strokeStyle = distributionStore.selectedDistribution && distribution.id === distributionStore.selectedDistribution.id
          ? 'rgb(253,216,53)'
          : 'rgb(211,47,47)';
      } else {
        canvasContext.value.fillStyle = 'rgba(67,160,71,0.50)'
        canvasContext.value.strokeStyle = distributionStore.selectedDistribution && distribution.id === distributionStore.selectedDistribution.id
          ? 'rgb(253,216,53)'
          : 'rgb(46,125,50)';
      }

      const centerX = distribution.positions_on_bench[0] + bench.positions[0] + distribution.dimensions[0] / 2;
      const centerY = distribution.positions_on_bench[1] + bench.positions[1] + distribution.dimensions[1] / 2;

      canvasContext.value.font = 'bold 14px Arial';
      canvasContext.value.textAlign = 'center';
      canvasContext.value.textBaseline = 'middle';
      canvasContext.value.fillText(String(distribution.seed_quantity), centerX, centerY + 2);

      canvasContext.value.fillRect(
        distribution.positions_on_bench[0] + bench.positions[0],
        distribution.positions_on_bench[1] + bench.positions[1],
        distribution.dimensions[0],
        distribution.dimensions[1]
      );

      canvasContext.value.strokeRect(
        distribution.positions_on_bench[0] + bench.positions[0] + 1,
        distribution.positions_on_bench[1] + bench.positions[1] + 1,
        distribution.dimensions[0] - 1,
        distribution.dimensions[1] - 1
      );

      canvasContext.value.restore()
    })
  });
}

function handleMouseOverDistributions(event: MouseEvent) {
  if (!canvasRef.value) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  let cursor = 'default';

  for (const distribution of distributionStore.distributions) {
    const bench = benchStore.getBenchById(distribution.bench_id);

    if (bench === undefined) continue;

    if (
      mouseX >= distribution.positions_on_bench[0] + bench.positions[0] &&
      mouseX <= distribution.positions_on_bench[0] + bench.positions[0] + distribution.dimensions[0] &&
      mouseY >= distribution.positions_on_bench[1] + bench.positions[1] &&
      mouseY <= distribution.positions_on_bench[1] + bench.positions[1] + distribution.dimensions[1]
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
  let isOverDistribution = false;

  for (const bench of benchStore.benches) {
    if (
      mouseX >= bench.positions[0] &&
      mouseX <= bench.positions[0] + bench.dimensions[0] &&
      mouseY >= bench.positions[1] &&
      mouseY <= bench.positions[1] + bench.dimensions[1]
    ) {
      const distributions = distributionStore.getDistributionByBenchId(bench.id)

      if (!distributions) continue;

      for (const distribution of distributions) {
        if (
          mouseX >= distribution.positions_on_bench[0] + bench.positions[0] &&
          mouseX <= distribution.positions_on_bench[0] + bench.positions[0] + distribution.dimensions[0] &&
          mouseY >= distribution.positions_on_bench[1] + bench.positions[1] &&
          mouseY <= distribution.positions_on_bench[1] + bench.positions[1] + distribution.dimensions[1]
        ) {
          distributionStore.selectDistribution(distribution);

          clickOnX = mouseX - distribution.positions_on_bench[0];
          clickOnY = mouseY - distribution.positions_on_bench[1];

          isOverDistribution = true;
          break;
        }
      }

      isOverBench = true;
      clickIsOnBench = bench;
      break;
    }
  }

  if (!isOverBench) {
    clickIsOnBench = null;
  }

  if (!isOverDistribution) {
    clickOnX = mouseX;
    clickOnY = mouseY;

    distributionStore.selectDistribution(null);
  }

  if (isOverBench || isOverDistribution) {
    clickIsMaintained = true;
  }
}

function handleMouseUp(event: MouseEvent) {
  clickIsMaintained = false;

  if (distributionStore.selectedDistribution) {
    distributionStore.updateDistribution(distributionStore.selectedDistribution)
  } else {
    createNewDistribution(event);
  }
}

function handleMouseMove(event: MouseEvent) {
  if (!clickIsMaintained) return;

  if (distributionStore.selectedDistribution) {
    dragDistribution(event);
  } else {
    drawNewDistributionSelectionArea(event);
  }
}

function dragDistribution(event: MouseEvent) {
  if (!distributionStore.selectedDistribution || !canvasRef.value) return;

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    if (!canvasRef.value || !distributionStore.selectedDistribution) return;

    const rect = canvasRef.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const newPosX = mouseX - clickOnX;
    const newPosY = mouseY - clickOnY;

    distributionStore.updateDistributionPositions([newPosX, newPosY]);
    animationFrameId = null;
  });
}

function updateSelectedPot(value: number) {
  potStore.selectPot(value);
}

function updateFormDistributions() {
  formDistributions.value = [];

  const distributions = distributionStore.getDistributionByRequestDistributionId(requestDistributionId)
  if (!distributions) return

  distributions.forEach((distribution) => {
    const seed_quantity = distribution.seed_quantity
    const benchName = benchStore.getBenchById(distribution.bench_id)?.name
    const greenhouseName = greenhouseStore.getGreenhouseById(buildingId)?.name

    formDistributions.value.push({
      bench_name: benchName || "",
      greenhouse_name: greenhouseName || "",
      quantity: seed_quantity
    })
  })
}

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function drawNewDistributionSelectionArea(event: MouseEvent) {
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

async function createNewDistribution(event: MouseEvent) {
  if (!canvasRef.value || !clickIsOnBench) return;

  const rect = canvasRef.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const newWidth = Math.abs(mouseX - clickOnX);
  const newHeight = Math.abs(mouseY - clickOnY);

  if (newWidth < 10 || newHeight < 10) return;

  const pot = potStore.selectedPot
  if (!pot) {
    alert('Please select a pot');
    return;
  }

  const zoneArea = newWidth * newHeight;
  const seed_quantity = calculateNumberOfPotsWithSpacing(zoneArea, pot.area, formSpace.value)
  const distribution = {
    request_distribution_id: requestDistributionId,
    bench_id: clickIsOnBench.id,
    positions_on_bench: [((mouseX > clickOnX) ? clickOnX : mouseX) - clickIsOnBench.positions[0], ((mouseY > clickOnY) ? clickOnY : mouseY) - clickIsOnBench.positions[1]],
    dimensions: [newWidth, newHeight],
    seed_quantity: seed_quantity,
  };

  await distributionStore
    .addDistribution(distribution)
    .then(() => {
      if (distributionStore.selectedDistribution === null) return;

      requestDistributionStore.decreasesNumberOfSeedsLeftToPlant(requestDistributionId, seed_quantity)
      updateFormDistributions();
    })
    .catch(renderCanvas);
}

function calculateNumberOfPotsWithSpacing(areaZone: number, potArea: number, spacing: number) {
  const potSide = Math.sqrt(potArea);
  const effectiveSide = potSide + 2 * spacing;
  const potAreaWithSpacing = Math.pow(effectiveSide, 2);

  return Math.floor(areaZone / potAreaWithSpacing);
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.container {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translate(0%, -50%);
  width: 300px;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.request-distribution-container {
  display: flex;
  justify-content: space-between;

  padding: 16px;
  background: #f9f9f9;
}

.pot-selector-container {
  display: block;

  padding: 16px;
  background: #f9f9f9;
}

.distribution-container {
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px;
  background: #f9f9f9;
}

.v-list-item {
  width: 100%;
  margin: 0;
  padding: 0;
}

.distribution-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid #ccc;
  padding: 6px 16px;
  border-radius: 4px;
  background: #fff;
}

.bench-name {
  font-weight: bold;
  text-transform: capitalize;
  font-size: 14px;
}

.greenhouse-name {
  font-size: 12px;
  text-transform: capitalize;
}
</style>

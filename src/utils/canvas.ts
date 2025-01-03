import {Ref} from "vue";
import {BenchStore} from "@/store/BenchStore";
import {RequestDistributionStore} from "@/store/RequestDistribution";
import {PlantStore} from "@/store/PlantStore";
import {RequestStore} from "@/store/RequestStore";

const BENCH_CORNER_SIZE = 10;
const METRE_TO_PIXEL = 120;
const MOVE_STEP = 15;

type Size = {
  width: number,
  height: number
}

type Position = {
  x: number,
  y: number,
}

type Dimension = {
  w: number,
  h: number,
}

type Offsets = {
  x: number,
  y: number
}

type RequestInfoData = {
  plantName: string,
  plantStage: string,
  plantedAt: Date,
  requesterFirstName: string,
  requesterLastName: string,
}

export enum Corner {
  TopLeft = "top-left",
  TopRight = "top-right",
  BottomLeft = "bottom-left",
  BottomRight = "bottom-right",
}

function CreateContainerResizeObserver(
  container: Ref<HTMLElement | undefined>,
  sizeStat: Ref<{
    width: number,
    height: number
  }>): ResizeObserver {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const rect = entry.contentRect;
      sizeStat.value = {
        width: rect.width,
        height: rect.height,
      };
    }
  });

  if (container.value) {
    observer.observe(container.value);
  }

  return observer;
}

function SetupCanvas(canvasRef: Ref<HTMLCanvasElement | undefined>, canvasContext: Ref<CanvasRenderingContext2D | undefined>) {
  if (!canvasRef.value) return
  canvasContext.value = canvasRef.value.getContext('2d') || undefined;
}

function ResizeCanvas(canvasRef: Ref<HTMLCanvasElement | undefined>, width: number, height: number) {
  if (!canvasRef.value) return;

  canvasRef.value.width = width;
  canvasRef.value.height = height;
}

function CursorPointerWhenOverBench(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore) {
  const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

  if (!container.value) return;

  const overBenchId = mouseOverBench(mouseX, mouseY, offset, benchStore.benches);
  if (overBenchId === -1) {
    container.value.style.cursor = 'default';
    return;
  }

  container.value.style.cursor = 'pointer';
}

function CursorPointerWhenOverBenchCorner(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, selectedBenchId: number, cornerSize: number) {
  const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

  if (!container.value) return;

  const selectedBench = benchStore.getBenchById(selectedBenchId)
  if (!selectedBench) return;

  const overCornerId = mouseOverBenchCorner(mouseX, mouseY, offset, selectedBench, cornerSize);
  if (overCornerId === null) return;

  container.value.style.cursor = 'nwse-resize';
}

function CursorPointerWhenOverDistributions(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, distributionStore: RequestDistributionStore) {
  const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

  if (!container.value) return;

  const overBenchId = mouseOverBench(mouseX, mouseY, offset, benchStore.benches);
  if (overBenchId === -1) {
    container.value.style.cursor = 'default';
    return;
  }

  const overedBench = benchStore.getBenchById(overBenchId);
  const distributionsOfOveredBench = distributionStore.getDistributionByBenchId(overBenchId)

  if (!overedBench || distributionsOfOveredBench.length === 0) return;

  const overDistributionId = mouseOverDistribution(mouseX, mouseY, offset, overedBench, distributionsOfOveredBench)
  if (overDistributionId === -1) {
    container.value.style.cursor = 'default';
    return;
  }

  container.value.style.cursor = 'pointer';
}

function BenchUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore): number | null {
  const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

  const overBenchId = mouseOverBench(mouseX, mouseY, offset, benchStore.benches)
  if (overBenchId === -1) return null

  const overedBench = benchStore.getBenchById(overBenchId);
  if (!overedBench) return null;

  return overedBench.id;
}

function BenchCornerUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, selectedBenchId: number | null, cornerSize: number): Corner | null {
  const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

  if (!selectedBenchId) return null;

  const selectedBench = benchStore.getBenchById(selectedBenchId);
  if (!selectedBench) return null;

  const overCornerId = mouseOverBenchCorner(mouseX, mouseY, offset, selectedBench, cornerSize);
  if (overCornerId === null) return null;

  return overCornerId;
}

function DistributionUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, distributionStore: RequestDistributionStore): number | null {
  const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

  const overBenchId = mouseOverBench(mouseX, mouseY, offset, benchStore.benches)
  if (overBenchId === -1) return null

  const overedBench = benchStore.getBenchById(overBenchId);
  const distributionsOfOveredBench = distributionStore.getDistributionByBenchId(overBenchId)

  if (!overedBench || distributionsOfOveredBench.length === 0) return null;

  const overDistributionId = mouseOverDistribution(mouseX, mouseY, offset, overedBench, distributionsOfOveredBench);
  if (overDistributionId === -1) return null

  return overDistributionId;
}

function ApplyMouseMoveOnOffset(event: MouseEvent, offset: Ref<Offsets>, startMousePosition: Position, startOffset: Offsets) {
  const deltaX = event.clientX - startMousePosition.x;
  const deltaY = event.clientY - startMousePosition.y;

  offset.value = {
    x: Math.min(0, startOffset.x + deltaX),
    y: Math.min(0, startOffset.y + deltaY),
  };
}

function ApplyMouseMoveOnBenchResize(event: MouseEvent, benchStore: BenchStore, selectedCorner: Corner, selectedBenchId: number, startMousePosition: Position, startBenchPosition: Position, startBenchDimension: Dimension) {
  const bench = benchStore.getBenchById(selectedBenchId);
  if (!bench) return;

  const deltaX = normalizesMoveStep(event.clientX - startMousePosition.x);
  const deltaY = normalizesMoveStep(event.clientY - startMousePosition.y);

  switch (selectedCorner) {
    case Corner.TopLeft:
      benchStore.updateBenchPositions(selectedBenchId, startBenchPosition.x + deltaX, startBenchPosition.y + deltaY);
      benchStore.updateBenchDimensions(selectedBenchId, startBenchDimension.w - deltaX, startBenchDimension.h - deltaY);
      break;

    case Corner.TopRight:
      benchStore.updateBenchPositions(selectedBenchId, startBenchPosition.x, startBenchPosition.y + deltaY);
      benchStore.updateBenchDimensions(selectedBenchId, startBenchDimension.w + deltaX, startBenchDimension.h - deltaY);
      break;

    case Corner.BottomLeft:
      benchStore.updateBenchPositions(selectedBenchId, startBenchPosition.x + deltaX, startBenchPosition.y);
      benchStore.updateBenchDimensions(selectedBenchId, startBenchDimension.w - deltaX, startBenchDimension.h + deltaY);
      break;

    case Corner.BottomRight:
      benchStore.updateBenchPositions(selectedBenchId, startBenchPosition.x, startBenchPosition.y);
      benchStore.updateBenchDimensions(selectedBenchId, startBenchDimension.w + deltaX, startBenchDimension.h + deltaY);
      break;
  }
}

function ApplyMouseMoveOnBenchPositions(event: MouseEvent, benchStore: BenchStore, selectedBenchId: number, startMousePosition: Position, startBenchPosition: Position) {
  const bench = benchStore.getBenchById(selectedBenchId);
  if (!bench) return;

  const deltaX = normalizesMoveStep(event.clientX - startMousePosition.x);
  const deltaY = normalizesMoveStep(event.clientY - startMousePosition.y);

  benchStore.updateBenchPositions(selectedBenchId, startBenchPosition.x + deltaX, startBenchPosition.y + deltaY);
}

function GetRequestInfoFromDistribution(selectedDistributionId: number, distributionStore: RequestDistributionStore, plantStore: PlantStore, requestStore: RequestStore): RequestInfoData | null {
  const selectedDistribution = distributionStore.getDistributionById(selectedDistributionId);
  if (!selectedDistribution) return null;

  const plant = plantStore.getPlantByPlantStageId(selectedDistribution.plant_stage_id);
  if (!plant) return null;

  const request = requestStore.getRequestById(selectedDistribution.request_id);
  if (!request) return null;

  return {
    plantName: plant.name,
    plantStage: plant.plant_stages.find(ps => ps.id == selectedDistribution.plant_stage_id)?.name ?? 'Unknown',
    plantedAt: selectedDistribution.created_at,
    requesterFirstName: request.requester_first_name,
    requesterLastName: request.requester_last_name,
  }
}

function CheckOverflow(selectedBenchId: number, benchStore: BenchStore): boolean {
  const selectedBench = benchStore.getBenchById(selectedBenchId);
  if (!selectedBench) return false;

  const [x1, y1] = selectedBench.positions;
  const [w1, h1] = selectedBench.dimensions;

  let overflow = false;
  for (const bench of benchStore.benches) {
    if (bench.id === selectedBenchId) continue;

    const [currentX, currentY] = bench.positions;
    const [currentW, currentH] = bench.dimensions;

    console.log(bench.id, selectedBenchId)
    console.log(bench, selectedBench)
    console.log(x1, currentX + currentW)
    console.log(x1 + w1, currentX)
    console.log(y1, currentY + currentH)
    console.log(y1 + h1, currentH)

    if (x1 < currentX + currentW && x1 + w1 > currentX && y1 < currentY + currentH && y1 + h1 > currentY) {
      overflow = true;
      break;
    }
  }

  return overflow;
}

function getCursorPositionInContainer(container: Ref<HTMLElement | undefined>, event: MouseEvent): number[] {
  if (!container.value) return [0, 0];

  const rect = container.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  return [mouseX, mouseY];
}

function mouseOverBench(mouseX: number, mouseY: number, offset: Offsets, benches: Bench[]): number {
  for (let i = 0; i < benches.length; i++) {
    const [x, y] = getBenchPositionWithOffset(offset, benches[i])
    const [w, h] = benches[i].dimensions

    if (mouseX >= x &&
      mouseX <= x + w &&
      mouseY >= y &&
      mouseY <= y + h) {
      return benches[i].id;
    }
  }

  return -1
}

function mouseOverDistribution(mouseX: number, mouseY: number, offset: Offsets, bench: Bench, distributions: RequestDistribution[]): number {
  const [bx, by] = getBenchPositionWithOffset(offset, bench)

  for (let i = 0; i < distributions.length; i++) {
    const [dx, dy] = distributions[i].positions_on_bench
    const [dw, dh] = distributions[i].dimensions

    if (mouseX >= dx + bx &&
      mouseX <= dx + bx + dw &&
      mouseY >= dy + by &&
      mouseY <= dy + by + dh) {
      return distributions[i].id;
    }
  }

  return -1
}

function getBenchPositionWithOffset(offset: Offsets, bench: Bench) {
  const [x, y] = [bench.positions[0] + offset.x, bench.positions[1] + offset.y]
  return [x, y]
}

function mouseOverBenchCorner(mouseX: number, mouseY: number, offset: Offsets, bench: Bench, cornerSize: number): Corner | null {
  const [x, y] = getBenchPositionWithOffset(offset, bench)
  const [w, h] = bench.dimensions;

  const corners = [
    {id: Corner.TopLeft, x: x - cornerSize / 2, y: y - cornerSize / 2},
    {id: Corner.TopRight, x: x + w - cornerSize / 2, y: y - cornerSize / 2},
    {id: Corner.BottomLeft, x: x - cornerSize / 2, y: y + h - cornerSize / 2},
    {id: Corner.BottomRight, x: x + w - cornerSize / 2, y: y + h - cornerSize / 2},
  ];

  const hoveredCorner = corners.find(
    corner =>
      mouseX >= corner.x &&
      mouseX <= corner.x + cornerSize &&
      mouseY >= corner.y &&
      mouseY <= corner.y + cornerSize
  );

  return hoveredCorner ? hoveredCorner.id : null;
}

function normalizesMoveStep(d: number): number {
  return Math.floor(d / MOVE_STEP) * MOVE_STEP;
}

function NormalizesUnitToMetre(d: number): number {
  const result = d / METRE_TO_PIXEL;
  return parseFloat(result.toFixed(2));
}

export {
  BENCH_CORNER_SIZE,
  METRE_TO_PIXEL,
  CreateContainerResizeObserver,
  SetupCanvas,
  ResizeCanvas,
  CursorPointerWhenOverBench,
  CursorPointerWhenOverBenchCorner,
  CursorPointerWhenOverDistributions,
  BenchUnderCursor,
  BenchCornerUnderCursor,
  DistributionUnderCursor,
  ApplyMouseMoveOnOffset,
  ApplyMouseMoveOnBenchResize,
  ApplyMouseMoveOnBenchPositions,
  GetRequestInfoFromDistribution,
  NormalizesUnitToMetre,
  CheckOverflow
};
export type {Size, Offsets, Position, Dimension, RequestInfoData};

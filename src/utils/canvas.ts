import {Ref} from "vue";
import {BenchStore} from "@/store/BenchStore";
import {RequestDistributionStore} from "@/store/RequestDistribution";
import {PlantStore} from "@/store/PlantStore";
import {RequestStore} from "@/store/RequestStore";
import {RequestModel} from "@/model/RequestModel";

const CORNER_SIZE = 10;
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
  const mousePos = GetCursorPositionInContainer(container, event)

  if (!container.value) return;

  const overBenchId = mouseOverBench(mousePos.x, mousePos.y, offset, benchStore.benches);
  if (overBenchId === -1) {
    container.value.style.cursor = 'default';
    return;
  }

  container.value.style.cursor = 'pointer';
}

function CursorPointerWhenOverBenchCorner(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, selectedBenchId: number, cornerSize: number) {
  const mousePos = GetCursorPositionInContainer(container, event)

  if (!container.value) return;

  const selectedBench = benchStore.getBenchById(selectedBenchId)
  if (!selectedBench) return;

  const pos = {x: selectedBench.positions[0], y: selectedBench.positions[1]};
  const dim = {w: selectedBench.dimensions[0], h: selectedBench.dimensions[1]};
  const overCornerId = mouseOverCorner(mousePos, offset, pos, dim, cornerSize);
  if (overCornerId === null) return;

  container.value.style.cursor = 'nwse-resize';
}

function CursorPointerWhenOverDistributionCorner(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, distributionStore: RequestDistributionStore, selectedDistributionId: number, cornerSize: number) {
  const mousePos = GetCursorPositionInContainer(container, event)

  if (!container.value) return;

  const selectedDistribution = distributionStore.getDistributionById(selectedDistributionId)
  if (!selectedDistribution) return;

  const selectedBench = benchStore.getBenchById(selectedDistribution.bench_id)
  if (!selectedBench) return;

  const pos = {
    x: selectedBench.positions[0] + selectedDistribution.positions_on_bench[0],
    y: selectedBench.positions[1] + selectedDistribution.positions_on_bench[1]
  };
  const dim = {w: selectedDistribution.dimensions[0], h: selectedDistribution.dimensions[1]};
  const overCornerId = mouseOverCorner(mousePos, offset, pos, dim, cornerSize);
  if (overCornerId === null) return;

  container.value.style.cursor = 'nwse-resize';
}

function CursorPointerWhenOverDistributions(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, distributionStore: RequestDistributionStore) {
  const mousePos = GetCursorPositionInContainer(container, event)

  if (!container.value) return;

  const overBenchId = mouseOverBench(mousePos.x, mousePos.y, offset, benchStore.benches);
  if (overBenchId === -1) {
    container.value.style.cursor = 'default';
    return;
  }

  const overedBench = benchStore.getBenchById(overBenchId);
  const distributionsOfOveredBench = distributionStore.getDistributionByBenchId(overBenchId)

  if (!overedBench || distributionsOfOveredBench.length === 0) return;

  const overDistributionId = mouseOverDistribution(mousePos.x, mousePos.y, offset, overedBench, distributionsOfOveredBench)
  if (overDistributionId === -1) {
    container.value.style.cursor = 'default';
    return;
  }

  container.value.style.cursor = 'pointer';
}

function BenchUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore): number | null {
  const mousePos = GetCursorPositionInContainer(container, event)

  const overBenchId = mouseOverBench(mousePos.x, mousePos.y, offset, benchStore.benches)
  if (overBenchId === -1) return null

  const overedBench = benchStore.getBenchById(overBenchId);
  if (!overedBench) return null;

  return overedBench.id;
}

function BenchCornerUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, selectedBenchId: number | null, cornerSize: number): Corner | null {
  const mousePos = GetCursorPositionInContainer(container, event)

  if (!selectedBenchId) return null;

  const selectedBench = benchStore.getBenchById(selectedBenchId);
  if (!selectedBench) return null;

  const pos = {x: selectedBench.positions[0], y: selectedBench.positions[1]};
  const dim = {w: selectedBench.dimensions[0], h: selectedBench.dimensions[1]};
  const overCornerId = mouseOverCorner(mousePos, offset, pos, dim, cornerSize);
  if (overCornerId === null) return null;

  return overCornerId;
}

function DistributionUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, distributionStore: RequestDistributionStore): number | null {
  const mousePos = GetCursorPositionInContainer(container, event)

  const overBenchId = mouseOverBench(mousePos.x, mousePos.y, offset, benchStore.benches)
  if (overBenchId === -1) return null

  const overedBench = benchStore.getBenchById(overBenchId);
  const distributionsOfOveredBench = distributionStore.getDistributionByBenchId(overBenchId)

  if (!overedBench || distributionsOfOveredBench.length === 0) return null;

  const overDistributionId = mouseOverDistribution(mousePos.x, mousePos.y, offset, overedBench, distributionsOfOveredBench);
  if (overDistributionId === -1) return null

  return overDistributionId;
}

function DistributionCornerUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benchStore: BenchStore, distributionStore: RequestDistributionStore, selectedDistributionId: number | null, cornerSize: number): Corner | null {
  const mousePos = GetCursorPositionInContainer(container, event)

  if (!selectedDistributionId) return null;

  const selectedDistribution = distributionStore.getDistributionById(selectedDistributionId);
  if (!selectedDistribution) return null;

  const selectedBench = benchStore.getBenchById(selectedDistribution.bench_id);
  if (!selectedBench) return null;

  const pos = {
    x: selectedBench.positions[0] + selectedDistribution.positions_on_bench[0],
    y: selectedBench.positions[1] + selectedDistribution.positions_on_bench[1]
  };
  const dim = {w: selectedDistribution.dimensions[0], h: selectedDistribution.dimensions[1]};
  const overCornerId = mouseOverCorner(mousePos, offset, pos, dim, cornerSize);
  if (overCornerId === null) return null;

  return overCornerId;
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

function ApplyMouseMoveOnDistributionResize(event: MouseEvent, distributionStore: RequestDistributionStore, selectedCorner: Corner, selectedDistributionId: number, startMousePosition: Position, startDistributionPosition: Position, startDistributionDimension: Dimension) {
  const distribution = distributionStore.getDistributionById(selectedDistributionId);
  if (!distribution) return;

  const deltaX = normalizesMoveStep(event.clientX - startMousePosition.x);
  const deltaY = normalizesMoveStep(event.clientY - startMousePosition.y);

  switch (selectedCorner) {
    case Corner.TopLeft:
      distributionStore.updateDistributionPositions(selectedDistributionId, startDistributionPosition.x + deltaX, startDistributionPosition.y + deltaY);
      distributionStore.updateDistributionDimensions(selectedDistributionId, startDistributionDimension.w - deltaX, startDistributionDimension.h - deltaY);
      break;

    case Corner.TopRight:
      distributionStore.updateDistributionPositions(selectedDistributionId, startDistributionPosition.x, startDistributionPosition.y + deltaY);
      distributionStore.updateDistributionDimensions(selectedDistributionId, startDistributionDimension.w + deltaX, startDistributionDimension.h - deltaY);
      break;

    case Corner.BottomLeft:
      distributionStore.updateDistributionPositions(selectedDistributionId, startDistributionPosition.x + deltaX, startDistributionPosition.y);
      distributionStore.updateDistributionDimensions(selectedDistributionId, startDistributionDimension.w - deltaX, startDistributionDimension.h + deltaY);
      break;

    case Corner.BottomRight:
      distributionStore.updateDistributionPositions(selectedDistributionId, startDistributionPosition.x, startDistributionPosition.y);
      distributionStore.updateDistributionDimensions(selectedDistributionId, startDistributionDimension.w + deltaX, startDistributionDimension.h + deltaY);
      break;
  }
}

function GetSelectedArea(container: Ref<HTMLElement | undefined>, event: MouseEvent, startMousePosition: Position): [position: Position, dimension: Dimension] {
  const mousePos = GetCursorPositionInContainer(container, event)

  const deltaX = normalizesMoveStep(mousePos.x - startMousePosition.x);
  const deltaY = normalizesMoveStep(mousePos.y - startMousePosition.y);

  let startX = normalizesMoveStep(startMousePosition.x);
  let startY = normalizesMoveStep(startMousePosition.y);

  if (deltaX < 0) {
    startX += deltaX;
  }
  if (deltaY < 0) {
    startY += deltaY;
  }

  return [
    {x: startX, y: startY},
    {w: Math.abs(deltaX), h: Math.abs(deltaY)}
  ]
}

function ApplyMouseMoveOnBenchPositions(event: MouseEvent, benchStore: BenchStore, selectedBenchId: number, startMousePosition: Position, startBenchPosition: Position) {
  const bench = benchStore.getBenchById(selectedBenchId);
  if (!bench) return;

  const deltaX = normalizesMoveStep(event.clientX - startMousePosition.x);
  const deltaY = normalizesMoveStep(event.clientY - startMousePosition.y);

  benchStore.updateBenchPositions(selectedBenchId, startBenchPosition.x + deltaX, startBenchPosition.y + deltaY);
}

function ApplyMouseMoveOnDistributionPositions(event: MouseEvent, benchStore: BenchStore, distributionStore: RequestDistributionStore, selectedDistributionId: number, startMousePosition: Position, startDistributionPosition: Position) {
  const distribution = distributionStore.getDistributionById(selectedDistributionId);
  if (!distribution) return;

  const deltaX = normalizesMoveStep(event.clientX - startMousePosition.x);
  const deltaY = normalizesMoveStep(event.clientY - startMousePosition.y);

  distributionStore.updateDistributionPositions(selectedDistributionId, startDistributionPosition.x + deltaX, startDistributionPosition.y + deltaY);
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

function CheckBenchOverflow(selectedBenchId: number, benchStore: BenchStore): boolean {
  const selectedBench = benchStore.getBenchById(selectedBenchId);
  if (!selectedBench) return false;

  const [x1, y1] = selectedBench.positions;
  const [w1, h1] = selectedBench.dimensions;

  let overflow = false;
  for (const bench of benchStore.benches) {
    if (bench.id === selectedBenchId) continue;

    const [currentX, currentY] = bench.positions;
    const [currentW, currentH] = bench.dimensions;

    if (x1 < currentX + currentW && x1 + w1 > currentX && y1 < currentY + currentH && y1 + h1 > currentY) {
      overflow = true;
      break;
    }
  }

  return overflow;
}

function CheckDistributionOverflow(selectedDistributionId: number, distributionStore: RequestDistributionStore, benchStore: BenchStore): boolean {
  const selectedDistribution = distributionStore.getDistributionById(selectedDistributionId);
  if (!selectedDistribution) return false;

  const [selectedDistributionX, selectedDistributionY] = selectedDistribution.positions_on_bench;
  const [selectedDistributionW, selectedDistributionH] = selectedDistribution.dimensions;

  const selectedBench = benchStore.getBenchById(selectedDistribution.bench_id);
  if (!selectedBench) return false;

  const distributionsOnBench = distributionStore.getDistributionByBenchId(selectedDistribution.bench_id);
  if (distributionsOnBench.length === 0) return false;

  let overflow = false;
  for (const distribution of distributionsOnBench) {
    if (distribution.id === selectedDistributionId) continue;

    const [currentX, currentY] = distribution.positions_on_bench;
    const [currentW, currentH] = distribution.dimensions;

    if (
      selectedDistributionX < currentX + currentW &&
      selectedDistributionX + selectedDistributionW > currentX &&
      selectedDistributionY < currentY + currentH &&
      selectedDistributionY + selectedDistributionH > currentY
    ) {
      overflow = true;
      break;
    }
  }
  return overflow;
}

function CheckDistributionIsNotOnBench(selectedDistributionId: number, distributionStore: RequestDistributionStore, benchStore: BenchStore): boolean {
  const selectedDistribution = distributionStore.getDistributionById(selectedDistributionId);
  if (!selectedDistribution) return false;

  const [selectedDistributionX, selectedDistributionY] = selectedDistribution.positions_on_bench;
  const [selectedDistributionW, selectedDistributionH] = selectedDistribution.dimensions;

  const selectedBench = benchStore.getBenchById(selectedDistribution.bench_id);
  if (!selectedBench) return false;

  const [selectedBenchW, selectedBenchH] = selectedBench.dimensions

  if (
    (selectedDistributionX >= 0 && selectedDistributionY >= 0) &&
    (selectedDistributionX + selectedDistributionW <= selectedBenchW) &&
    (selectedDistributionY + selectedDistributionH <= selectedBenchH)
  ) {
    return false
  } else {
    const globalX = selectedBench.positions[0] + selectedDistributionX;
    const globalY = selectedBench.positions[1] + selectedDistributionY;

    return !attacheDistributionToBench(selectedDistributionId, benchStore, distributionStore, globalX, globalY, selectedDistributionW, selectedDistributionH);
  }
}

function GetCursorPositionInContainer(container: Ref<HTMLElement | undefined>, event: MouseEvent): Position {
  if (!container.value) return {x: 0, y: 0};

  const rect = container.value.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  return {x: mouseX, y: mouseY};
}

function NewBenchFromArea(area: [Position, Dimension], benchStore: BenchStore, greenhouseId: number, offset: Offsets): number | null {
  const [pos, dim] = area;
  pos.x += Math.abs(offset.x);
  pos.y += Math.abs(offset.y);

  const id = benchStore.addBench(pos, dim, greenhouseId)

  if (CheckBenchOverflow(id, benchStore)) {
    benchStore.removeBench(id);
    throw new Error("La table est en chevauchement avec une autre table.");
  }

  return id;
}

function NewDistributionFromArea(area: [Position, Dimension], request: RequestModel, potId: number, potQuantity: number, benchStore: BenchStore, distributionStore: RequestDistributionStore, offset: Offsets): number | null {
  const [pos, dim] = area;
  pos.x += Math.abs(offset.x);
  pos.y += Math.abs(offset.y);

  const id = distributionStore.addDistribution(request.id, pos, dim, potId, potQuantity, request.plant_stage_id)

  if (!attacheDistributionToBench(id, benchStore, distributionStore, pos.x, pos.y, dim.w, dim.h)) {
    distributionStore.removeDistribution(id)
    throw new Error("La position de la distribution est invalide.");
  }

  const distribution = distributionStore.getDistributionById(id);
  if (!distribution) return null;

  if (CheckDistributionOverflow(id, distributionStore, benchStore)) {
    distributionStore.removeDistribution(id)
    throw new Error("La distribution est en chevauchement avec une autre distribution.");
  }

  return id;
}

function NormalizesUnitToMetre(d: number): number {
  const result = d / METRE_TO_PIXEL;
  return parseFloat(result.toFixed(2));
}

function NormalizesMetreToUnit(d: number): number {
  const result = d * METRE_TO_PIXEL;
  return parseFloat(result.toFixed(2));
}

function CalculateNumberOfPotsWithSpacing(dim: Dimension, potArea: number, spacing: number) {
  const potSide = Math.sqrt(potArea);
  const effectiveSide = potSide + spacing;
  const potAreaWithSpacing = Math.pow(effectiveSide, 2);
  const areaZone = dim.w * dim.h;

  return Math.abs(Math.floor(areaZone / potAreaWithSpacing));
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

function getPositionWithOffset(offset: Offsets, pos: Position): Position {
  const [x, y] = [pos.x + offset.x, pos.y + offset.y];
  return {x, y};
}

function mouseOverCorner(mousePos: Position, offset: Offsets, shapePos: Position, shapeDim: Dimension, cornerSize: number): Corner | null {
  const {x, y} = getPositionWithOffset(offset, shapePos);
  const {w, h} = shapeDim;

  const corners = [
    {id: Corner.TopLeft, x: x - cornerSize / 2, y: y - cornerSize / 2},
    {id: Corner.TopRight, x: x + w - cornerSize / 2, y: y - cornerSize / 2},
    {id: Corner.BottomLeft, x: x - cornerSize / 2, y: y + h - cornerSize / 2},
    {id: Corner.BottomRight, x: x + w - cornerSize / 2, y: y + h - cornerSize / 2},
  ];

  const hoveredCorner = corners.find(
    corner =>
      mousePos.x >= corner.x &&
      mousePos.x <= corner.x + cornerSize &&
      mousePos.y >= corner.y &&
      mousePos.y <= corner.y + cornerSize
  );

  return hoveredCorner ? hoveredCorner.id : null;
}

function normalizesMoveStep(d: number): number {
  return Math.floor(d / MOVE_STEP) * MOVE_STEP;
}

function attacheDistributionToBench(selectedDistributionId: number, benchStore: BenchStore, distributionStore: RequestDistributionStore, globalX: number, globalY: number, w: number, h: number): boolean {
  let onBench = false;
  for (const bench of benchStore.benches) {
    const [currentX, currentY] = bench.positions;
    const [currentW, currentH] = bench.dimensions;
    if (
      globalX >= currentX &&
      globalX + w <= currentX + currentW &&
      globalY >= currentY &&
      globalY + h <= currentY + currentH
    ) {
      onBench = true
      distributionStore.updateDistributionBenchId(selectedDistributionId, bench.id)
      distributionStore.updateDistributionPositions(selectedDistributionId, globalX - currentX, globalY - currentY)
      break;
    }
  }
  return onBench;
}

export {
  CORNER_SIZE,
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
  GetSelectedArea,
  CheckBenchOverflow,
  GetCursorPositionInContainer,
  NewBenchFromArea,
  NormalizesMetreToUnit,
  ApplyMouseMoveOnDistributionPositions,
  CheckDistributionOverflow,
  CheckDistributionIsNotOnBench,
  NewDistributionFromArea,
  DistributionCornerUnderCursor,
  ApplyMouseMoveOnDistributionResize,
  CursorPointerWhenOverDistributionCorner,
  CalculateNumberOfPotsWithSpacing
};
export type {Size, Offsets, Position, Dimension, RequestInfoData};

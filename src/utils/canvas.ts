import {Ref} from "vue";
import {RequestModel} from "@/model/RequestModel";

type Size = {
    width: number,
    height: number
}

type Position = {
    x: number,
    y: number,
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

function CursorPointerWhenOverDistributions(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benches: Bench[], distributions: RequestDistribution[]) {
    const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

    if (!container.value) return;

    const overBenchId = mouseOverBench(mouseX, mouseY, offset, benches);
    if (overBenchId === -1) {
        container.value.style.cursor = 'default';
        return;
    }

    const overedBench = benches.find(b => b.id === overBenchId);
    const distributionsOfOveredBench = distributions.filter(d => d.bench_id === overBenchId)

    if (!overedBench || distributionsOfOveredBench.length === 0) return;

    const overDistributionId = mouseOverDistribution(mouseX, mouseY, offset, overedBench, distributionsOfOveredBench)
    if (overDistributionId === -1) {
        container.value.style.cursor = 'default';
        return;
    }

    container.value.style.cursor = 'pointer';
}

function DistributionUnderCursor(container: Ref<HTMLElement | undefined>, event: MouseEvent, offset: Offsets, benches: Bench[], distributions: RequestDistribution[]): number | null {
    const [mouseX, mouseY] = getCursorPositionInContainer(container, event)

    const overBenchId = mouseOverBench(mouseX, mouseY, offset, benches)
    if (overBenchId === -1) return null

    const overedBench = benches.find(b => b.id === overBenchId);
    const distributionsOfOveredBench = distributions.filter(d => d.bench_id === overBenchId)

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

function GetRequestInfoFromDistribution(selectedDistributionId: number, distributions: RequestDistribution[], plants: Plant[], requests: RequestModel[]): RequestInfoData | null {
    const selectedDistribution = distributions.find(d => d.id === selectedDistributionId)
    if (!selectedDistribution) return null

    const plant = plants.find(p => p.plant_stages.some(ps => ps.id == selectedDistribution.plant_stage_id))
    if (!plant) return null

    const request = requests.find(r => r.id == selectedDistribution.request_id)
    if (!request) return null

    return {
        plantName: plant.name,
        plantStage: plant.plant_stages.find(ps => ps.id == selectedDistribution.plant_stage_id)?.name ?? 'Unknown',
        plantedAt: selectedDistribution.created_at,
        requesterFirstName: request.requester_first_name,
        requesterLastName: request.requester_last_name,
    }
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

export {
    CreateContainerResizeObserver,
    SetupCanvas,
    ResizeCanvas,
    CursorPointerWhenOverDistributions,
    DistributionUnderCursor,
    ApplyMouseMoveOnOffset,
    GetRequestInfoFromDistribution
};
export type {Size, Offsets, Position, RequestInfoData};


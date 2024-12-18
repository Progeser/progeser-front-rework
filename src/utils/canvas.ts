import {Ref} from "vue";

function setupCanvas(canvasRef: Ref<HTMLCanvasElement | undefined>, canvasContext: Ref<CanvasRenderingContext2D | undefined>) {
  if (!canvasRef.value) return
  canvasContext.value = canvasRef.value.getContext('2d') || undefined;
}

function resizeCanvas(canvasRef: Ref<HTMLCanvasElement | undefined>, width: number, height: number) {
  if (!canvasRef.value) return;

  canvasRef.value.width = width;
  canvasRef.value.height = height;
}

export {setupCanvas, resizeCanvas}

<template>
  <v-container class="container" fluid>
    <!--
    <div ref="containerRef" class="canvas-container">
      <GridComponent :height='size.height' :space='30' :width='size.width'/>
      <BenchesComponent :benches="data" :display-labels='true' :height='size.height' :selected-bench-id='1'
                        :width='size.width'/>
    </div>
    <ToolsComponent class="tools"/>
    -->
    <InfoComponent :plant-name='"Plant 1"'/>
  </v-container>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, Ref, ref} from "vue";
import InfoComponent from "@/components/canvas/InfoComponent.vue";

const containerRef: Ref<HTMLElement | null> = ref(null);
const size: Ref<{ width: number, height: number }> = ref({width: 0, height: 0});

const data: Ref<Bench[]> = ref([
  {
    id: 1,
    greenhouse_id: 1,
    name: "Bench 1",
    positions: [30, 30],
    dimensions: [100, 100],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    greenhouse_id: 1,
    name: "Bench 2",
    positions: [80, 200],
    dimensions: [220, 200],
    created_at: new Date(),
    updated_at: new Date()
  }
]);

onMounted(async () => {
  resize();
  addEventListeners();
});

onBeforeUnmount(() => {
  removeEventListeners();
});

function addEventListeners() {
  window.addEventListener('resize', resize);
}

function removeEventListeners() {
  window.removeEventListener('resize', resize);
}

function resize() {
  if (!containerRef.value) return;

  size.value = {
    width: containerRef.value.clientWidth,
    height: containerRef.value.clientHeight,
  }
}

</script>
<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;
}

.tools {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}

.canvas-container {
  position: absolute;
  width: 100%;
  height: 100%;

  margin: 0;
  padding: 0;
  z-index: 10;
}

.canvas-container > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

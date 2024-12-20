<template>
  <div class="box">
    <div v-for="tool in props.tools" :key="tool">
      <button
        class="btn"
        v-bind:class="{ selected: tool === props.selected }"
        @click="onToolClick(tool)"
      >
        {{ tool }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tools: string[],
  selected: string,
  onToolSelect: (tool: string) => void
}>();

function onToolClick(tool: string) {
  props.onToolSelect(tool);
}
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 5px;

  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}

.btn {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
}

.btn:hover {
  background: #e0e0e0;
}

.selected, .selected:hover {
  background: #009dff;
  color: #fff;
}
</style>

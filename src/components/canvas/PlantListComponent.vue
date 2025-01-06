<template>
  <div class="plant-card">
    <h2 class="plant-card__title">Plants</h2>
    <div class="plant-card__plant-list">
      <div
        v-for="item in plant"
        :key="item.id"
        :class="['plant-card__plant-list__plant', { 'selected-plant': props.selected.includes(item.id) }]"
        @click="handleCardClick(item)"
      >
        <p class="plant-card__plant-list__plant__name">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  plant: { id: number; name: string }[];
  selected: number[];
  onSelectedPlant: (id: number) => void;
}>();

const handleCardClick = (item: { id: number; name: string }) => {
  props.onSelectedPlant(item.id);
};
</script>

<style scoped>
.plant-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 100%;
}

.plant-card__title {
  font-size: 22px;
  font-weight: bold;
  margin-top: 16px;
  color: #333;
  text-align: center;
}

.plant-card__plant-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  flex-grow: 1;
  overflow-y: auto;

  padding: 12px 16px 16px 16px;
}

.plant-card__plant-list__plant {
  cursor: pointer;
  background: #fff;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px;
  text-align: center;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease,
  box-shadow 0.5s ease,
  border-color 0.5s ease,
  background-color 0.5s ease;
}

.plant-card__plant-list__plant:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  border-color: #2196f3;
}

.selected-plant {
  background-color: #e3f2fd;
  border-color: #2196f3;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
  transform: translateY(0);
}

.selected-plant:hover {
  box-shadow: 0 8px 16px rgba(33, 150, 243, 0.6);
  transform: translateY(-4px);
}

.plant-card__plant-list__plant__name {
  color: #333;
  margin: 0;
}
</style>

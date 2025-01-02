<template>
  <transition name="slide">
    <div v-if="props.info != null" class="info-card">
      <h2 class="info-card__title">Plant Details</h2>
      <div class="info-card__content">
        <div class="info-card__row">
          <span class="info-card__label">🌱 Plant Name:</span>
          <span class="info-card__value">{{ props.info.plantName }}</span>
        </div>
        <div class="info-card__row">
          <span class="info-card__label">🔄 Plant Stage:</span>
          <span class="info-card__value">{{ props.info.plantStage }}</span>
        </div>
        <div class="info-card__row">
          <span class="info-card__label">📅 Planted At:</span>
          <span class="info-card__value">{{ formatDate(props.info.plantedAt) }}</span>
        </div>
        <div class="info-card__row">
          <span class="info-card__label">👤 Requester:</span>
          <span class="info-card__value">
            {{ props.info.requesterLastName }} {{ props.info.requesterFirstName }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {RequestInfoData} from "@/utils/canvas";
import {formatDate} from "@/utils/date";

const props = defineProps<{
  info: RequestInfoData | null;
}>();
</script>

<style scoped>
.info-card {
  display: block;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-card__title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.info-card__content {
  display: grid;
  gap: 4px;
}

.info-card__row {
  display: flex;
  align-items: center;
}

.info-card__label {
  flex-shrink: 0;
  width: 120px;
  font-weight: bold;
  color: #555;
  display: flex;
  align-items: center;
}

.info-card__value {
  flex-grow: 1;
  color: #000;
  overflow-wrap: break-word;
}

.slide-enter-active {
  animation: slide-in 0.5s ease-in-out;
}

.slide-leave-active {
  animation: slide-out 0.5s ease-in-out;
}

@keyframes slide-in {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>

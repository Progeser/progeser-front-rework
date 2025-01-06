<template>
  <v-slide-y-transition>
    <v-card v-if="props.info" class="card" elevation="3" max-width="800">
      <v-card-title class="text-h6 text-center">Plant Details</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col class="font-weight-bold" cols="5">🌱 Plant Name:</v-col>
          <v-col cols="5">{{ props.info.plantName }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="font-weight-bold" cols="5">🔄 Plant Stage:</v-col>
          <v-col cols="5">{{ props.info.plantStage }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="font-weight-bold" cols="5">📅 Planted At:</v-col>
          <v-col cols="5">{{ formatDate(props.info.plantedAt) }}</v-col>
        </v-row>
        <v-row dense>
          <v-col class="font-weight-bold" cols="5">👤 Requester:</v-col>
          <v-col cols="5">
            {{ props.info.requesterLastName }} {{ props.info.requesterFirstName }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-slide-y-transition>
</template>

<script lang="ts" setup>
import {RequestInfoData} from "@/utils/canvas";
import {formatDate} from "@/utils/date";

const props = defineProps<{
  info: RequestInfoData | null;
}>();
</script>

<style scoped>
.card {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>

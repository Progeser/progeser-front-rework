<template>
  <v-card class="card pa-4" max-width="400">
    <v-card-text>
      <v-autocomplete
        v-model="selectedPot"
        :items="props.pots"
        :label="t('canvas.distributionTool.selectPot')"
        clearable
        item-title="name"
        item-value="id"
        @update:modelValue="props.selectPot"
      ></v-autocomplete>
      <v-text-field
        v-model="spacing"
        :label="t('canvas.distributionTool.spacings')"
        class="mt-4"
        min="0"
        type="number"
        @update:modelValue="props.updateSpacing"
      ></v-text-field>
      <v-card-actions v-if="props.request" class="pa-0">
        <v-btn
          :disabled="props.request.quantity != planedSeed"
          class="darker-btn"
          width="100%"
          @click="props.save()"
        >
          {{ t('canvas.distributionTool.save') }} ({{ planedSeed }} / {{ props.request.quantity }})
        </v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {defineProps, ref, watch} from "vue";
import {RequestModel} from "@/model/RequestModel";
import {RequestDistributionStore} from "@/store/RequestDistribution";
import {useI18n} from "vue-i18n";

const selectedPot = ref<number | null>(null);
const planedSeed = ref<number>(0);
const spacing = ref<number>(0);

const {t} = useI18n();

const props = defineProps<{
  pots: Pot[],
  request: RequestModel | null,
  distributionStore: RequestDistributionStore,
  selectPot: (id: number) => void,
  updateSpacing: (value: string) => void,
  save: () => void,
}>();

watch(() => [props.distributionStore.requestDistributions, props.request], () => {
  if (!props.request) return;
  planedSeed.value = props.distributionStore.gedPlantedSeedsForRequest(props.request.id)
});
</script>

<style scoped>
.card {
  display: block;
}

.darker-btn {
  background-color: #43a047;
  color: white;
}
</style>

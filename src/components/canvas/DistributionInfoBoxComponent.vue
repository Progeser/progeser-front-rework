<template>
  <v-card v-if="props.selectedDistributionId" class="info-box" outlined>
    <v-card-title>
      <span>{{ t('canvas.distributionInfoBox.title') }}</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field v-model.number="formData.x" :label="t('canvas.distributionInfoBox.positionX')" outlined
                      type="number"/>
        <v-text-field v-model.number="formData.y" :label="t('canvas.distributionInfoBox.positionY')" outlined
                      type="number"/>
        <v-text-field v-model.number="formData.width" :label="t('canvas.distributionInfoBox.width')" outlined
                      type="number"/>
        <v-text-field v-model.number="formData.height" :label="t('canvas.distributionInfoBox.height')" outlined
                      type="number"/>
        <v-text-field v-model.number="formData.potQuantity" :label="t('canvas.distributionInfoBox.potQuantity')"
                      outlined type="number"/>
        <v-text-field v-model.number="area" :label="t('canvas.distributionInfoBox.area')" outlined
                      readonly/>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save">{{ t('canvas.distributionInfoBox.save') }}</v-btn>
      <v-btn color="red darken-1" @click="props.removeDistribution()">{{
          t('canvas.distributionInfoBox.remove')
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {computed, defineProps, reactive, watch} from "vue";
import {RequestDistributionStore} from "@/store/RequestDistribution";
import {NormalizesMetreToUnit, NormalizesUnitToMetre} from "@/utils/canvas";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const formData = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  potQuantity: 0,
});

const area = computed(() => {
  const result = formData.width * formData.height
  return result.toFixed(2);
});

const props = defineProps<{
  distributionStore: RequestDistributionStore;
  selectedDistributionId: number | null
  removeDistribution: () => void;
  saveDistribution: (x: number, y: number, w: number, h: number, potQuantity: number) => void;
}>();

function save() {
  props.saveDistribution(
    NormalizesMetreToUnit(formData.x),
    NormalizesMetreToUnit(formData.y),
    NormalizesMetreToUnit(formData.width),
    NormalizesMetreToUnit(formData.height),
    formData.potQuantity
  )
}

watch(() => [props.distributionStore.requestDistributions, props.selectedDistributionId], () => {
  if (!props.selectedDistributionId) return;
  const selectedDistribution = props.distributionStore.getDistributionById(props.selectedDistributionId)
  if (!selectedDistribution) return
  updateFormData(selectedDistribution);
});

function updateFormData(requestDistribution: RequestDistribution) {
  formData.x = NormalizesUnitToMetre(requestDistribution.positions_on_bench[0]);
  formData.y = NormalizesUnitToMetre(requestDistribution.positions_on_bench[1]);
  formData.width = NormalizesUnitToMetre(requestDistribution.dimensions[0]);
  formData.height = NormalizesUnitToMetre(requestDistribution.dimensions[1]);
  formData.potQuantity = requestDistribution.pot_quantity;
}
</script>

<style scoped>
.info-box {
  overflow: scroll;
}

.info-box v-card {
  padding: 10px;
}
</style>

<template>
  <v-card v-if="props.selectedBenchId" class="info-box" outlined>
    <v-card-title>
      <span>{{ t('canvas.benchInfoBox.title') }}</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field v-model="formData.name" :label="t('canvas.benchInfoBox.name')" outlined></v-text-field>
        <v-text-field v-model.number="formData.x" :label="t('canvas.benchInfoBox.positionX')" outlined
                      type="number"></v-text-field>
        <v-text-field v-model.number="formData.y" :label="t('canvas.benchInfoBox.positionY')" outlined
                      type="number"></v-text-field>
        <v-text-field v-model.number="formData.width" :label="t('canvas.benchInfoBox.width')" outlined
                      type="number"></v-text-field>
        <v-text-field v-model.number="formData.height" :label="t('canvas.benchInfoBox.height')" outlined
                      type="number"></v-text-field>
        <v-text-field v-model.number="area" :label="t('canvas.benchInfoBox.area')" outlined readonly></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save">{{ t('canvas.benchInfoBox.save') }}</v-btn>
      <v-btn color="red darken-1" @click="props.removeBench()">{{ t('canvas.benchInfoBox.remove') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import {computed, defineProps, reactive, watch} from "vue";
import {BenchStore} from "@/store/BenchStore";
import {NormalizesMetreToUnit, NormalizesUnitToMetre} from "@/utils/canvas";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const formData = reactive({
  name: "",
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

const area = computed(() => {
  const result = formData.width * formData.height
  return result.toFixed(2);
});

const props = defineProps<{
  benchStore: BenchStore;
  selectedBenchId: number | null
  removeBench: () => void;
  saveBench: (name: string, x: number, y: number, w: number, h: number) => void;
}>();

watch(() => [props.benchStore.benches, props.selectedBenchId], () => {
  if (!props.selectedBenchId) return;
  const selectedBench = props.benchStore.getBenchById(props.selectedBenchId)
  if (!selectedBench) return
  updateFormData(selectedBench);
});

function updateFormData(bench: Bench) {
  formData.name = bench.name;
  formData.x = NormalizesUnitToMetre(bench.positions[0]);
  formData.y = NormalizesUnitToMetre(bench.positions[1]);
  formData.width = NormalizesUnitToMetre(bench.dimensions[0]);
  formData.height = NormalizesUnitToMetre(bench.dimensions[1]);
}

function save() {
  props.saveBench(
    formData.name,
    NormalizesMetreToUnit(formData.x),
    NormalizesMetreToUnit(formData.y),
    NormalizesMetreToUnit(formData.width),
    NormalizesMetreToUnit(formData.height)
  );
}

</script>

<style scoped>
.info-box {
  width: 300px;
  overflow: scroll;
}

.info-box v-card {
  padding: 10px;
}
</style>

<template>
  <div class="ma-10" v-if="container">
    <v-row class="justify-space-between align-center">
      <h1>{{ t('form.container.title') }}</h1>
      <v-btn color="error" @click="deleteContainer()" class="align-self-center">
        {{ t('common.delete') }}
      </v-btn>
    </v-row>
    <v-col class="ma-5">
      <v-col>
        <h2 class="mr-2 align-self-center">{{ t('form.container.nameTitle') }}</h2>
        <v-text-field
          v-model="container.name"
          variant="outlined"
          class="custom-input align-self-center"
          hide-details
        />
      </v-col>
      <v-col>
        <h2 class="mr-2">{{ t('form.container.shape') }}</h2>
        <v-select
          v-model="container.shape.name"
          :items="shapes"
          variant="outlined"
          class="custom-input"
          @change="updateDimensionNames"
        />
      </v-col>
      <v-col v-if="isOtherShape">
        <h2 class="mr-2">{{ t('form.container.area') }} (en cm²)</h2>
        <v-text-field
          v-model="container.area"
          variant="outlined"
          class="custom-input"
          type="number"
          hide-details
        />
      </v-col>
      <v-col v-else>
        <h2 class="mr-2">
          {{ t('form.container.dimensions') + " (" + dimensionNames + ")" }}
        </h2>
        <v-text-field
          v-model="dimensionsInput"
          variant="outlined"
          class="custom-input"
          auto-grow
        />
      </v-col>
    </v-col>
    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'containers' })">{{ t('common.cancel') }}</v-btn>
      <v-btn @click="sendContainer()" color="primary">{{ t('common.send') }}</v-btn>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount } from "vue";
import ContainerRepository from "@/repository/containerRepository";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Container, ContainerShape, getDimensionsNamesFromShape } from "@/model/Container";

const containerRepository = new ContainerRepository();
const container = ref<Container>(new Container());
const router = useRouter();
const { t } = useI18n();
const shapes = Object.values(ContainerShape);

const props = defineProps<{ id: number }>();

const dimensionsInput = ref<string>("");

const dimensionNames = computed(() =>
  getDimensionsNamesFromShape(container.value.shape.name)
);

const isOtherShape = computed(() => container.value.shape.name === ContainerShape.OTHER);

const updateContainer = async () => {
  if (props.id.toString() !== "0") {
    container.value = await containerRepository.getContainer(props.id);
    dimensionsInput.value = container.value.dimensions?.join(", ") || "";
  }
};

const sendContainer = async () => {
  if (dimensionsInput.value && !isOtherShape.value) {
    container.value.dimensions = dimensionsInput.value.split(",").map(dim => parseInt(dim.trim(), 10));
    container.value.area = null;
  }
  if (isOtherShape.value) {
    container.value.dimensions = null;
  }
  if (props.id.toString() !== "0") {
    await containerRepository.putContainer(container.value?.id!, container.value);
  } else {
    await containerRepository.postContainer(container.value);
  }
  await router.push({ name: "containers" });
};

const deleteContainer = async () => {
  if (confirm(t("form.container.confirmDelete"))) {
    await containerRepository.deleteContainer(container.value.id!);
    await router.push({ name: "containers" });
  }
};

const updateDimensionNames = () => {
  dimensionsInput.value = "";
  container.value.area = null;
};

onBeforeMount(async () => {
  await updateContainer();
});
</script>

<style scoped>
.custom-input :deep(input) {
  font-size: 1em !important;
  height: auto !important;
  padding: 0.5em !important;
}
</style>

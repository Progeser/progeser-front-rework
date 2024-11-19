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
          :error="!!errors.name"
          :error-messages="errors.name"
          variant="outlined"
          class="custom-input align-self-center"
          @input="validateName"
        />
      </v-col>

      <v-col>
        <h2 class="mr-2">{{ t('form.container.shape') }}</h2>
        <v-select
          v-model="container.shape.name"
          :error="!!errors.shape"
          :error-messages="errors.shape"
          :item-title="(item: string) => t('form.container.shapes.' + item)"
          :item-value="(item: string) => item"
          :items="shapes"
          variant="outlined"
          class="custom-input"
          @change="validateShape"
        />
      </v-col>

      <v-col v-if="isOtherShape">
        <h2 class="mr-2">{{ t('form.container.area') }} en cm²</h2>
        <v-text-field
          v-model="container.area"
          :error="!!errors.area"
          :error-messages="errors.area"
          variant="outlined"
          class="custom-input"
          type="number"
          @input="validateArea"
        />
      </v-col>

      <v-col v-else>
        <h2 class="mr-2">
          {{ t('form.container.dimensions') + " (" + dimensionNames + ")" }}
        </h2>
        <v-text-field
          v-model="dimensionsInput"
          :error="!!errors.dimensions"
          :error-messages="errors.dimensions"
          variant="outlined"
          class="custom-input"
          rows="2"
          auto-grow
          placeholder="e.g. 10, 20"
          @input="validateDimensions"
        />
      </v-col>
    </v-col>

    <v-row class="d-flex justify-space-between align-center">
      <v-btn @click="router.push({ name: 'containers' })">{{ t('common.cancel') }}</v-btn>
      <v-btn
        @click="submitContainer()"
        color="primary"
        :disabled="!isFormValid"
      >
        {{ t('common.send') }}
      </v-btn>
    </v-row>
  </div>
</template>


<script lang="ts" setup>
import {ref, computed, onBeforeMount, watch} from "vue";
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
const errors = ref<Record<string, string | null>>({});

const dimensionNames = computed(() => getDimensionsNamesFromShape(container.value.shape.name));
const isOtherShape = computed(() => container.value.shape.name === ContainerShape.OTHER);

watch(isOtherShape, () => {
  updateDimensionNames();
});

const isFormValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null);
});

const validateName = () => {
  errors.value.name = container.value.name.trim()
    ? null
    : t("form.container.errors.nameRequired");
};

const validateShape = () => {
  errors.value.shape = container.value.shape.name.trim()
    ? null
    : t("form.container.errors.shapeRequired");
};

const validateDimensions = () => {
  if (!isOtherShape.value) {
    const dimensions = dimensionsInput.value.split(",").map(d => d.trim());
    switch (container.value.shape.name) {
      case ContainerShape.CIRCLE:
      case ContainerShape.SQUARE:
        errors.value.dimensions =
          dimensions.length === 1 && parseFloat(dimensions[0]) > 0
            ? null
            : t("form.container.errors.dimensionsInvalid");
        break;
      case ContainerShape.RECTANGLE:
      case ContainerShape.TRIANGLE:
        errors.value.dimensions =
          dimensions.length === 2 && dimensions.every(dim => parseFloat(dim) > 0)
            ? null
            : t("form.container.errors.dimensionsInvalid");
        break;
      default:
        errors.value.dimensions = t("form.container.errors.invalidShape");
    }
  }
};

const validateArea = () => {
  if (isOtherShape.value) {
    errors.value.area = container.value.area && container.value.area > 0
      ? null
      : t("form.container.errors.areaRequired");
  }
};

const updateDimensionNames = () => {
  if (isOtherShape.value) {
    console.log("isOtherShape");
    dimensionsInput.value = "";
    container.value.dimensions = null;
    errors.value.dimensions = null;
  } else {
    container.value.area = null;
    errors.value.area = null;
  }
};

const updateContainer = async () => {
  if (props.id.toString() !== "0") {
    container.value = await containerRepository.getContainer(props.id);
    dimensionsInput.value = container.value.dimensions?.join(", ") || "";
  }
};

const submitContainer = async () => {
  validateName();
  validateShape();
  validateDimensions();
  validateArea();

  if (!isFormValid.value) return;

  if (!isOtherShape.value) {
    container.value.dimensions = dimensionsInput.value.split(",").map(dim => parseFloat(dim.trim()));
    container.value.area = null;
  } else {
    container.value.dimensions = null;
  }

  try {
    if (props.id.toString() !== "0") {
      await containerRepository.putContainer(container.value.id!, container.value);
    } else {
      await containerRepository.postContainer(container.value);
    }
    await router.push({ name: "containers" });
  } catch (error) {
    console.error(error);
  }
};

const deleteContainer = async () => {
  if (confirm(t("form.container.confirmDelete"))) {
    await containerRepository.deleteContainer(container.value.id!);
    await router.push({ name: "containers" });
  }
};

onBeforeMount(async () => {
  await updateContainer();
});

</script>



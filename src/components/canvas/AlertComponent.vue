<template>
  <v-alert
    v-model="alertVisible"
    dismissible
    type="error"
  >
    {{ props.error ? props.error.message : '' }}
  </v-alert>
</template>
<script lang="ts" setup>

import {ref, watch} from "vue";

const alertVisible = ref(false);

const props = defineProps<{
  error: Error | null,
}>();

watch(() => [props.error], () => {
  if (!props.error) return;
  showAlert();
});

function showAlert() {
  alertVisible.value = true;
  setTimeout(() => {
    alertVisible.value = false;
  }, 3000);
}
</script>

<style scoped>

</style>

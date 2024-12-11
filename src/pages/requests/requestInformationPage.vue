<template>
  <v-btn
    class="ml-2"
    variant="outlined"
    color="success"
  >
    {{ t('common.accept') }}
    <v-icon icon="mdi-check" />
  </v-btn>
  <v-btn
    class="ml-2"
    variant="outlined"
    color="error"
  >
    {{ t('common.reject') }}
    <v-icon icon="mdi-close" />
  </v-btn>
</template>
<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { t } = useI18n()

defineProps({
  idRequest: Number
})
</script>
<style scoped>
</style>

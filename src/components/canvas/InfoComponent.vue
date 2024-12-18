<template>
  <v-container class="container" fluid>
    <v-expansion-panels>
      <v-expansion-panel-title>
        <v-row no-gutters>
          <v-col>
            Trip name
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <p>{{ props.plantName }}</p>
      </v-expansion-panel-text>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts" setup>
const props = defineProps<{
  plantName: string;
}>();
</script>

<style scoped>
</style>

<template>
  <v-data-table
    :headers="headers as any"
    :items="data"
    :loading="loading"
    :page="currentPage"
    :items-per-page="currentItemsPerPage"
    :total-items="totalItems"
    :page-count="totalPages"
    :items-per-page-options="[
      { value: 10, title: '10' },
      { value: 20, title: '20' },
      { value: 50, title: '50' }
    ]"
    @update:page="onPageChange"
    @update:items-per-page="onItemsPerPageChange"
    style="border: #008B8B 2px solid; border-radius: 10px"
  >
    <template v-slot:top>
      <v-toolbar class="text-center" color="primary" rounded>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <slot name="actions" :item="item" />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  data: { type: Array, required: true },
  headers: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  execOnUpdate: { type: Function, required: true },
  totalItems: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(['update:page', 'update:itemsPerPage']);

const currentPage = ref(1);
const currentItemsPerPage = ref(10);

const onPageChange = (page: number) => {
  currentPage.value = page;
  props.execOnUpdate();
  emit('update:page', page);
};

const onItemsPerPageChange = (itemsPerPage: number) => {
  currentItemsPerPage.value = itemsPerPage;
  props.execOnUpdate();
  emit('update:itemsPerPage', itemsPerPage);
};

onMounted(() => {
  props.execOnUpdate();
});
</script>

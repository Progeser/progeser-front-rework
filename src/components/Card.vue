<template>
  <v-card class="mx-auto rounded-lg" :min-width="width">
    <div class="position-relative">
      <v-btn icon="mdi-pencil" class="bg-white mr-1 position-absolute btn-position" style="z-index: 2" @click="exec()"/>
      <v-img :height="imgHeight" :src="imgSource" cover/>
    </div>
    <v-container :height="textHeight">
      <v-card-title> {{title}} </v-card-title>
      <v-card-text> {{description}} </v-card-text>
    </v-container>
  </v-card>
</template>

<script lang="ts" setup>

defineProps({
  title : {
    type : String
  },
  imgSource : {
    type : String
  },
  description : {
    type : String
  },
  width : {
    type : Number,
    default : 300
  },
  imgHeight : {
    type : Number,
    default : 200
  },
  exec : {
    type : Function,
    default : () => null
  },
  textHeight : {
    type: Number
  }
})

</script>
<style scoped>
.btn-position{
  z-index: 2;
  right: 8px;
  top: 8px;
}
</style>

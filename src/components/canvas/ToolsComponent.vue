<template>
  <v-container class="container" fluid>
    <div class="box">
      <p>Hello</p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.container {
  position: relative;
  height: 100%;
  width: 100%;

  margin: 0;
  padding: 0;
}

.box {
  position: absolute;

  display: inline-block;
  padding: 6px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  height: auto;

  bottom: 15px;
  right: 50%;
  transform: translate(50%, 0%);
}
</style>

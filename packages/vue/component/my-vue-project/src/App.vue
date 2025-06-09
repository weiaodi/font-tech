<template>
  <h1 class="msg">{{ msg }}</h1>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const msg = ref('hello word');
</script>

<style scoped>
.msg {
  color: red;
  font-weight: bold;
}
</style>

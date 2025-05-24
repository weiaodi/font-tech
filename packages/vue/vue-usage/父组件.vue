<template>
  <div>
    <p>父组件中的 count: {{ count }}</p>
    <ChildComponent :count="count" @updateCount="updateCount" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

// 定义响应式数据
const count = ref(0);

// 更新 count 的方法
const updateCount = (newValue) => {
  count.value = newValue;
};
</script>

<template>
  <div>
    <p>子组件接收到的 count: {{ props.count }}</p>
    <button @click="handleIncrement">增加</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义接收的 props
const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
});

// 定义要触发的事件
const emits = defineEmits(['updateCount']);

// 处理点击事件
const handleIncrement = () => {
  // 通过 emit 通知父组件更新数据
  emits('updateCount', props.count + 1);
};
</script>

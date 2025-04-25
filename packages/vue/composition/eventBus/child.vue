<template>
  <div>
    <button @click="sendMessageToParent">向父组件发送消息</button>
    <p>接收到父组件的消息: {{ messageFromParent }}</p>
  </div>
</template>

<script>
import { eventBus } from './event-bus.js';

export default {
  data() {
    return {
      messageFromParent: '',
    };
  },
  mounted() {
    eventBus.$on('message-from-parent', (message) => {
      this.messageFromParent = message;
    });
  },
  beforeUnmount() {
    // 在子组件卸载后  因为监听事件其实是其他vue实例 event-bus完成 所以需要卸载掉event-bus上的事件 否者会造成内存泄漏
    eventBus.$off('message-from-parent');
  },
  methods: {
    sendMessageToParent() {
      eventBus.$emit('message-from-child', '这是来自子组件的消息');
    },
  },
};
</script>

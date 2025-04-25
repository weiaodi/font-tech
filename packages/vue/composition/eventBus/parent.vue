<template>
  <div>
    <button @click="sendMessageToChild">向子组件发送消息</button>
    <p>接收到子组件的消息: {{ messageFromChild }}</p>
    <ChildComponent />
  </div>
</template>

<script>
import { eventBus } from './event-bus.js';
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent,
  },
  data() {
    return {
      messageFromChild: '',
    };
  },
  mounted() {
    // 父子嵌套生命周期  会先执行父组件中的前三个后 执行子组件的前三个 再去执行父组件的mounted
    // 因此应该在   子组件:创建前-创建后-挂载前-挂载后 父组件:挂载后  执行监听函数才有效
    eventBus.$on('message-from-child', (message) => {
      this.messageFromChild = message;
    });
  },
  beforeUnmount() {
    eventBus.$off('message-from-child');
  },
  methods: {
    sendMessageToChild() {
      eventBus.$emit('message-from-parent', '这是来自父组件的消息');
    },
  },
};
</script>

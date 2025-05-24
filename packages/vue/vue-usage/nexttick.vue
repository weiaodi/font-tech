<template>
  <div>
    <p id="message">{{ message }}</p>
    <button @click="updateMessage">更新消息</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '初始消息',
    };
  },
  methods: {
    updateMessage() {
      this.message = '更新后的消息';
      // 错误示例：直接访问 DOM，此时 DOM 可能未更新
      // console.log(document.getElementById('message').textContent);

      // 使用 $nextTick 确保 DOM 已更新
      this.$nextTick(() => {
        console.log(document.getElementById('message').textContent);
      });
    },
  },
};
</script>

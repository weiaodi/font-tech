class EventEmitter {
  constructor() {
    // 用于存储事件及其对应的回调函数列表
    this.events = {};
  }
}

// 使用示例
const emitter = new EventEmitter();

// 定义一个回调函数
const callback = (message) => {
  console.log(`收到消息: ${message}`);
};

// 订阅事件

// 发布事件

// 取消订阅

// 再次发布事件，此时不会触发回调函数

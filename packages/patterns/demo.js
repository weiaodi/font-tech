class EventEmitter {
  constructor() {
    this.tasks = {};
  }
  on(eventName, callback) {
    if (!this.tasks[eventName]) {
      this.tasks[eventName] = [];
    }
    this.tasks[eventName].push(callback);
  }
  emit(eventName, ...args) {
    if (this.tasks[eventName]) {
      this.tasks[eventName].forEach((callback) => {
        callback(...args);
      });
    }
  }
  off(eventName, callback) {
    if (this.tasks[eventName]) {
      this.tasks[eventName] = this.tasks[eventName].filter((fn) => fn !== callback);
    }
  }
}

// 使用示例
const emitter = new EventEmitter();

// 定义一个回调函数
const callback = (message) => {
  console.log(`收到消息: ${message}`);
};

// 订阅事件
emitter.on('message', callback);

// 发布事件
emitter.emit('message', 'Hello, World!');

// 取消订阅
emitter.off('message', callback);

// 再次发布事件，此时不会触发回调函数
emitter.emit('message', '再次发送消息');

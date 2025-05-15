class EventEmitter {
  constructor() {
    // 用于存储事件及其对应的回调函数列表
    this.events = new Map();
  }
  on(message, callback) {
    if (!this.events.has(message)) {
      this.events.set(message, []);
    }
    this.events.get(message).push(callback);
  }
  emit(message, ...args) {
    if (!this.events.has(message)) {
      return new Error('event not defined');
    }
    this.events.get(message).forEach((fn) => {
      fn(...args);
    });
  }
  off(message, callback) {
    if (this.events.has(message)) {
      let callbacks = this.events.get(message).filter((fn) => fn !== callback);
      this.events.set(message, callbacks);
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
emitter.emit('message', 'data');
// 取消订阅
emitter.off('message', callback);
// 再次发布事件，此时不会触发回调函数
emitter.emit('message', 'data111');

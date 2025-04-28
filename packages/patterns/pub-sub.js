class EventEmitter {
  constructor() {
    // 用于存储事件及其对应的回调函数列表
    this.events = {};
  }

  // 订阅事件的方法
  on(eventName, callback) {
    if (!this.events[eventName]) {
      // 如果事件不存在，则初始化一个空数组来存储回调函数
      this.events[eventName] = [];
    }
    // 将回调函数添加到对应事件的回调函数列表中
    this.events[eventName].push(callback);
  }

  // 发布事件的方法
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      // 遍历对应事件的回调函数列表，并依次调用每个回调函数
      this.events[eventName].forEach((callback) => callback(...args));
    }
  }

  // 取消订阅事件的方法
  off(eventName, callback) {
    if (this.events[eventName]) {
      // 过滤掉要取消的回调函数
      this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
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

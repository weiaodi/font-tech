`then` 方法返回新的 Promise 是为了实现**链式调用（Chaining）**，这是 Promise 设计的核心特性之一。通过返回新的 Promise，你可以像这样编写代码：

```javascript
fetchData()
  .then((data) => process(data))
  .then((result) => display(result))
  .catch((error) => handle(error));
```

这种链式结构让异步代码看起来更像同步代码，避免了回调地狱（Callback Hell）。下面详细解释为什么必须返回新的 Promise：

### **1. 每个 `then` 需要独立的状态**

每个 `then` 调用都可能有不同的状态：

- 前一个 Promise 可能已解决，但下一个 Promise 仍在等待
- 每个 `then` 的回调可能抛出错误或返回新的值

返回新的 Promise 可以隔离这些状态：

```javascript
const p1 = Promise.resolve(1);

const p2 = p1.then((value) => value + 1); // p2 是新的 Promise

const p3 = p2.then((value) => {
  throw new Error('出错了');
}); // p3 有自己的状态

p3.catch((error) => console.error(error)); // 只捕获 p3 的错误
```

### **2. 传递结果和错误**

新的 Promise 负责传递上一个 Promise 的结果或错误：

- 如果前一个 Promise 成功，新 Promise 的状态由 `onFulfilled` 回调决定
- 如果前一个 Promise 失败，新 Promise 的状态由 `onRejected` 回调决定

```javascript
Promise.resolve(1)
  .then((value) => {
    return value * 2; // 第一个 then 返回新 Promise，状态为 resolved(2)
  })
  .then((value) => {
    throw new Error('出错了'); // 第二个 then 返回新 Promise，状态为 rejected
  })
  .catch((error) => {
    return 100; // catch 返回新 Promise，状态为 resolved(100)
  });
```

### **3. 支持嵌套 Promise 的扁平化**

如果 `onFulfilled` 或 `onRejected` 返回一个 Promise，新的 Promise 会等待这个嵌套 Promise 的结果：

```javascript
Promise.resolve(1)
  .then((value) => {
    // 返回一个新的 Promise
    return new Promise((resolve) => {
      setTimeout(() => resolve(value * 2), 1000);
    });
  })
  .then((result) => {
    console.log(result); // 2（1秒后输出）
  });
```

新的 Promise 会自动展开这个嵌套 Promise，确保链式调用的连续性。

### **4. 错误冒泡机制**

错误会跳过后续的 `then`，直到遇到第一个 `catch`：

```javascript
Promise.resolve(1)
  .then(() => {
    throw new Error('错误');
  })
  .then((value) => console.log(value)) // 跳过
  .catch((error) => console.error(error)); // 捕获错误
```

这种机制依赖于每个 `then` 返回新的 Promise，形成一个连续的错误处理链。

### **实现细节：为什么需要传入 `resolve` 和 `reject`？**

在你的代码中：

```javascript
then(onFulfilled, onRejected) {
  return new Mypromise((resolve, reject) => {
    this.#handlers.push({
      onFulfilled,
      onRejected,
      resolve, // 新 Promise 的 resolve
      reject,  // 新 Promise 的 reject
    });
    this.#run();
  });
}
```

这里的 `resolve` 和 `reject` 是新 Promise 的解决/拒绝函数。当旧 Promise 的状态变更时，会调用这些函数来改变新 Promise 的状态：

```javascript
// 在 #run() 方法中
if (this.#state === FULFILLED) {
  // 执行 onFulfilled 回调，并使用新 Promise 的 resolve/reject
  this.#runOne(onFulfilled, resolve, reject);
}
```

### **总结：为什么必须返回新的 Promise？**

1. **链式调用**：让多个异步操作可以串联执行
2. **状态隔离**：每个 `then` 有独立的状态管理
3. **结果传递**：将前一个 Promise 的结果传递给下一个
4. **错误处理**：实现错误冒泡机制
5. **Promise 扁平化**：自动处理嵌套 Promise

这是 Promise 设计的核心思想之一，也是它比传统回调更强大的原因。

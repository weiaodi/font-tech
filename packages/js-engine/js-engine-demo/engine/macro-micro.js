/* 
宏任务：可以理解为由宿主环境（如浏览器、Node.js）发起的异步任务。在浏览器环境中，常见的宏任务包括 setTimeout、setInterval、setImmediate（Node.js 环境）、requestAnimationFrame（浏览器环境）、I/O 操作、UI 渲染等。宏任务会被添加到宏任务队列中，等待主线程空闲时依次执行。

微任务：通常是由 JavaScript 引擎自身发起的异步任务。常见的微任务有 Promise.then、MutationObserver（浏览器环境）、process.nextTick（Node.js 环境）等。微任务会被添加到微任务队列中，在当前宏任务执行结束后，主线程会优先清空微任务队列，再去处理下一个宏任务
*/

console.log('1. 开始执行同步代码');

// 第一个宏任务
setTimeout(() => {
  console.log('4. 第一个 setTimeout 宏任务执行');
  Promise.resolve().then(() => {
    console.log('5. 第一个 setTimeout 中产生的微任务执行');
  });
}, 0);

// 第二个宏任务
setTimeout(() => {
  console.log('7. 第二个 setTimeout 宏任务执行');
  Promise.resolve().then(() => {
    console.log('8. 第二个 setTimeout 中产生的微任务执行');
  });
}, 0);

// 微任务
Promise.resolve().then(() => {
  console.log('3. Promise 微任务执行');
});

console.log('2. 同步代码执行结束');

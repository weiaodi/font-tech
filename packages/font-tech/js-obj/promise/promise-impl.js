const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  #state = PENDING;
  #result = undefined;
  #promise = undefined;
  #handlers = [];
  #changeState(state, result) {
    if (this.#state !== PENDING) {
      return;
    }
    this.#state = state;
    this.#result = result;
    // 在resolve的执行中,他需要做到的事情是
    //  1更改当前状态
    // 2执行then注册的回调函数
    // run()
  }
  #run() {
    if (this.#state === PENDING) {
      return;
    }
    // 执行完所有then注册的回调函数
    while (this.#handlers.length) {
      const { onFulfilled, onRejected, resolve, reject } = this.#handlers.shift();
      // 执行对应状态的回调函数,同时在回调函数中确定当前then中promise的状态是什么样的
      if (this.#state === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject);
      } else {
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }
  #runMicroTask(fn) {
    // 微任务队列的处理,先判断是浏览器还是node环境,然后再看兼容性,最差的情况用settimeout
    if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
      process.nextTick(fn);
    } else if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(fn);
      const textNode = document.createTextNode('1');
      observer.observe(textNode, {
        characterData: true,
      });
      textNode.data = '2';
    } else {
      setTimeout(() => {
        fn();
      });
    }
  }
  #runOne(callback, resolve, reject) {
    // 将函数放到微任务队列中进行执行, 判断callback函数的合理性和执行结果的合理性
  }
  then(onFulfilled, onRejected) {
    // 注册对应回调函数并执行,同时返回新的promise,用于隔离promise内部状态,每次的then都会决定当前的promise是什么状态
    this.#promise = new MyPromise((resolve, reject) => {
      this.#handlers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }
  constructor(executor) {
    const resolve = (data) => {
      this.#changeState(FULFILLED, data);
    };
    const reject = (data) => {
      this.#changeState(REJECTED, data);
    };
    // 如果代码抛错,按照rej执行
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
}

// 测试代码
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});

promise
  .then(null, (reason) => {
    console.log(reason); // 输出：成功
  })
  .then((value) => {
    console.log(value); // 输出：成功!
  });

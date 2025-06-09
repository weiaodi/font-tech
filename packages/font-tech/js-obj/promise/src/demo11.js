// 在promise中维护三个状态 pending fullfilled rejectd
// 在构造函数中 resolve,reject用于改变内部promise的状态,同时尝试执行已经注册的回调函数
// then负责注册回调函数
const PENDING = 'pending';
const FULFILLED = 'fullfilled';
const REJECTED = 'rejectd';
class Mypromise {
  // resolve执行结果
  #result;
  // then注册的回调函数
  #handlers = [];
  #promise;
  #state = PENDING;
  #run() {
    // 判断当前promise状态是否可执行
    if (this.#state === PENDING) {
      return;
    }
    // 根据then的注册顺序来依次执行回调函数
    while (this.#handlers.length) {
      const { onFulfilled, onRejected, resolve, reject } = this.#handlers.shift();
      if (this.#state === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject);
      } else if (this.#state === REJECTED) {
        this.#runOne(onRejected, resolve, reject);
      }
    }
    // 在微任务队列中执行对应的回调函数
  }
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== 'function') {
        resolve(this.#result);
      } else {
        try {
          let data = callback(this.#result);
          // 在then注册的回调函数中,如果当前执行结果也是promise,则应该等待这个结果的promise执行完成,然后在改变then中返回的promise状态
          if (this.#isPromiseLike(data)) {
            if (this.#promise === data) {
              throw new TypeError('Chaining cycle detected for promise ');
            }
            data.then(resolve, reject);
          } else {
            // 在then注册的回调函数中,如果当前执行结果非promise,则直接返回这个数值就行
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }
  #isPromiseLike(data) {
    if (typeof data === 'function' || (typeof data === 'object' && data !== null)) {
      return typeof data.then === 'function';
    }
    return false;
  }
  #runMicroTask(fn) {
    if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
      process.nextTick(fn);
    } else if (typeof queueMicrotask === 'function') {
      queueMicrotask(fn); // 标准方法
    } else if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(fn);
      const textNode = document.createTextNode('1');
      observer.observe(textNode, {
        characterData: true,
      });
      textNode.data = '2';
    } else {
      setTimeout(fn, 0);
    }
  }
  #changeState(state, result) {
    this.#state = state;
    this.#result = result;
    this.#run();
  }

  constructor(executor) {
    const resolve = (value) => {
      this.#changeState(FULFILLED, value);
    };
    const reject = (value) => {
      this.#changeState(REJECTED, value);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    // 保持当前promise实例
    this.#promise = new Promise((resolve, reject) => {
      this.#handlers.push({ onFulfilled, onRejected, resolve, reject });
      this.#run();
    });
    // 每个then函数返回一个promise以供支持链式调用
    return this.#promise;
  }
  static resolve(value) {
    // 传入promise直接返回promisse
    if (value instanceof Mypromise) return value;
    // 如果是promiseLike,执行then
    // 注意静态方法不能调用实例方法,得新建一个实例,还把状态改变方法暴露出来
    let _resolve, _reject;
    const p = new Mypromise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    if (p.#isPromiseLike(value)) {
      value.then(_resolve, _reject);
    } else {
      _resolve(value);
    }
    return p;
  }
  static reject(reason) {
    return new Mypromise((resolve, reject) => {
      reject(reason);
    });
  }
  catch(onRejected) {
    // 失败的回调
    return this.then(undefined, onRejected);
  }
  // Promise.prototype.finally
  finally(onFinally) {
    // 无论成功失败都会执行的回调
    // 不会传入参数,返回值要穿透
    return this.then(
      (data) => {
        onFinally();
        return data;
      },
      (err) => {
        onFinally();
        throw err;
      },
    );
  }
}
// 测试代码
let promise = new Mypromise((resolve, reject) => {
  setTimeout(() => {
    // resolve('成功');
    reject('失败');
  }, 1000);
});

promise
  .then(null, (reason) => {
    console.log(reason); // 输出：成功
    return Mypromise.reject('1111');
  })
  .then(
    (value) => {
      console.log('成功的结果', value);
    },
    (value) => {
      console.log('失败的结果', value);
    },
  );

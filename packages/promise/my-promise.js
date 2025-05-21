const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Mypromise {
  #state = PENDING;
  #result = undefined;
  #handlers = [];
  #promise = undefined;
  #changeState = (state, result) => {
    this.#state = state;
    this.#result = result;
    this.#run();
  };
  constructor(executor) {
    const resolve = (value) => {
      this.#changeState(FULFILLED, value);
    };
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  #runMicroTask(func) {
    if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
      process.nextTick(func);
    } else if (typeof queueMicrotask === 'function') {
      queueMicrotask(func); // 标准方法
    } else if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(func);
      const textNode = document.createTextNode('1');
      observer.observe(textNode, {
        characterData: true,
      });
      textNode.data = '2';
    } else {
      setTimeout(func, 0);
    }
  }
  #isPromiseLike(value) {
    if ((value !== null && typeof value === 'object') || typeof value === 'function') {
      return typeof value.then === 'function';
    }
    return false;
  }
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
      if (typeof callback !== 'function') {
        resolve(this.#result);
      } else {
        try {
          const data = callback(this.#result);
          if (this.#isPromiseLike(data)) {
            if (data === this.#promise) {
              throw new TypeError('Chaining cycle detected for promise');
            }
            data.then(resolve, reject);
          } else {
            resolve(data);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }
  #run() {
    if (this.#state === PENDING) return;
    while (this.#handlers.length) {
      const { resolve, onFulfilled, onRejected, reject } = this.#handlers.shift();
      if (this.#state === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject);
      } else if (this.#state === REJECTED) {
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }
  then(onFulfilled, onRejected) {
    this.#promise = new Mypromise((resolve, reject) => {
      this.#handlers.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
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
  // 静态方法,结果包到promise里
  static reject(reason) {
    return new Mypromise((resolve, reject) => {
      reject(reason);
    });
  }
  // 不是A+标准,是ES6加的
  // Promise.prototype.catch
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
  static all(promiseList) {
    return new Mypromise((resolve, reject) => {
      let result = [];
      let count = 0;
      promiseList.forEach((promise, index) => {
        Mypromise.resolve(promise)
          .then((value) => {
            result[index] = value;
            count++;
            if (count === promiseList.length) {
              resolve(result);
            }
          })
          .catch((reason) => {
            reject(reason);
          });
      });
    });
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
      console.log(value); // 输出：成功!
    },
    (value) => {
      console.log(value); // 输出：失败!
    },
  );

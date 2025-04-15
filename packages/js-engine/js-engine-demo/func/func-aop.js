class FuncWraper {
  constructor(fn) {
    this.fn = fn;
    this.counter = 0;
  }
  before(beforeFn) {
    this.fn = addBefore(this.fn, beforeFn);
    return this;
  }
  after(afterFn) {
    //  addbefore= this.fn  先执行前置函数 再执行原函数
    this.fn = addAfter(this.fn, afterFn);
    return this;
  }
  execute(...args) {
    return this.fn(...args);
  }
}
const addBefore = function (fn, beforeFn) {
  return function (...arg) {
    beforeFn.apply(this, arg);
    return fn.apply(this, arg);
  };
};

const addAfter = function (fn, afterFn) {
  return function (...arg) {
    const result = fn.apply(this, arg);
    afterFn.apply(this, arg);
    return result;
  };
};
/* 
此时函数的this为全局对象的this,如果访问的内容依赖对象变量,则会报错
  const addBefore =
  (fn, beforeFn) =>
  (...arg) => {
    beforeFn.apply(this, arg);
    return fn.apply(this, arg);
  };

const addAfter =
  (fn, afterFn) =>
  (...arg) => {
    const result = fn.apply(this, arg);
    afterFn.apply(this, arg);
    return result;
  };

  const aopDemoFn = new FuncWraper((a, b) => {
  console.log('执行了' + a + b);
  this.counter++; // 尝试访问实例属性
  console.log('执行了' + a + b + ', 计数器值: ' + this.counter);
})
  .before((...arg) => console.log('前执行了' + arg))
  .after((...arg) => console.log('后执行了' + arg));

aopDemoFn.execute('ces', 'aa');
  */

const aopDemoFn = new FuncWraper((a, b) => {
  console.log('执行了' + a + b);
  this.counter++; // 尝试访问实例属性
  console.log('执行了' + a + b + ', 计数器值: ' + this.counter);
})
  .before((...arg) => console.log('前执行了' + arg))
  .after((...arg) => console.log('后执行了' + arg));

aopDemoFn.execute('ces', 'aa');

/* 
 实现 
 
函数链式调用
面向切面的aop函数
 
 */
// 1实现一个计算器
const caculate = (value) => {
  return {
    res: value,
    minus(params) {
      this.res -= params;
      return this;
    },
    plus(params) {
      this.res -= params;
      return this;
    },
    result() {
      return this.res;
    },
  };
};
console.log('🚀 ~ caculate(1) ', caculate(1).minus(1).plus(10).result());
// 实现一个aop函数 在函数执行前和执行后都打印日志
class FnAopWrapper {
  constructor(fn) {
    this.fn = fn;
  }
  // 通过对fn的不断赋值,最后达成 切面编程的执行
  before(beforeFn) {
    this.fn = addBefore(this.fn, beforeFn);
    return this;
  }
  after(afterFn) {
    this.fn = addAfter(this.fn, afterFn);
    return this;
  }
  excute(...args) {
    this.fn(...args);
  }
}
//  添加执行前函数
const addBefore = function (fn, beforeFn) {
  return function (...args) {
    beforeFn.apply(this, args);
    // 返回被包裹的函数
    return fn.apply(this, args);
  };
};
// 后置执行函数
const addAfter = function (fn, afterFn) {
  return function (...args) {
    const res = fn.apply(this, args);
    afterFn.apply(this, args);
    return res;
  };
};

const aopFn = new FnAopWrapper(function demofn(params) {
  console.log('本体函数执行', params);
});
aopFn
  .before((a) => {
    console.log('前置函数', a);
  })
  .after((a) => {
    console.log('后置函数', a);
  })
  .excute('测试');

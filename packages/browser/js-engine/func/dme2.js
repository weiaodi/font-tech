/* 
函数柯里化
偏函数
管道函数
管道函数和柯里化结合
 */
// 1实现函数柯里化
function currySum(...args) {
  function curry(...params) {
    if (params.length !== 0) {
      args = args.concat(params);
      return curry;
    }
    // 收集完足够参数,进行函数操作
    // 这里模拟累加操作
    return args.reduce((pre, cur) => {
      return pre + cur;
    }, 0);
  }
  return curry;
}
// currySum(1)(2)(3)(4)();
// console.log('🚀 ~ currySum(1)(2)(3)(4)():', currySum(1)(2)(3)(4)());

// 2实现偏函数
function sum(...args) {
  return args.reduce((pre, cur) => {
    return pre + cur;
  }, 0);
}
function partialFn(fn, ...args) {
  return function (...newArgs) {
    return fn.apply(this, args.concat(newArgs));
  };
}
const sumPartial = partialFn(sum, 5);
// console.log('🚀 ~ sumPartial(6, 7):', sumPartial(6, 7));

// 3管道函数
// 示例操作函数
const addOne = (num) => num + 1;
const double = (num) => num * 2;
const subtractThree = (num) => num - 3;

function pipeline(...fns) {
  return (initValue) => fns.reduce((pre, cur) => cur(pre), initValue);
}
// const pipelinePre =
//   (...fns) =>
//   (initValue) =>
//     fns.reduce((pre, cur) => cur(pre), initValue);

const pipelineResFn = pipeline(addOne, double, subtractThree);
pipelineResFn(10);
// console.log('🚀 ~ pipelineResFn(10):', pipelineResFn(10));

// 4管道函数加上函数柯里化
// 返回三次 则就是需要三次调用来激活执行函数的操作
function pipelineCurry(...fns) {
  function curried(...newFns) {
    if (newFns.length !== 0) {
      fns = fns.concat(newFns);
      return curried;
    }
    // 执行管道柯里化函数
    return function name(initialValue) {
      return fns.reduce((pre, cur) => {
        return cur(pre);
      }, initialValue);
    };
  }
  return curried;
}

const pipelineCurryFn = pipelineCurry(addOne)(double)(subtractThree)();
// 传入初始值并执行操作
const result = pipelineCurryFn(5);
console.log('🚀 ~ pipelineCurryFn:', result);

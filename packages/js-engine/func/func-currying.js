const currying = (fn) => {
  return function judge(...args) {
    if (args.length === fn.length) {
      return fn(...args);
    }
    return function (arg) {
      return judge(...args, arg);
    };
  };
};

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = currying(add);

// 第一次调用 curriedAdd(1)
// 此时 args = [1]，args.length = 1，add.length = 3
// 由于 1 < 3，返回一个新函数
const step1 = curriedAdd(1);

// 第二次调用 step1(2)
// 此时 args = [1, 2]，args.length = 2，add.length = 3
// 由于 2 < 3，返回一个新函数
const step2 = step1(2);

// 第三次调用 step2(3)
// 此时 args = [1, 2, 3]，args.length = 3，add.length = 3
// 由于 3 === 3，调用 add(1, 2, 3) 并返回结果
const result = step2(3);

console.log(result); // 输出 6

function newSum(...args) {
  // 定义一个内部函数用于继续收集参数
  function curried(...newArgs) {
    // 将新传入的参数和之前的参数合并
    args = args.concat(newArgs);
    // 返回 curried 函数自身，继续等待接收参数
    return curried;
  }

  // 重写 curried 函数的 toString 方法
  curried.toString = function () {
    // 当进行隐式类型转换时，计算所有参数的和
    return args.reduce((sum, num) => sum + num, 0);
  };

  // 返回 curried 函数开始收集参数
  return curried;
}
console.log(Number(newSum(1)(2)(3)(4)));

// 管道函数和柯里化结合
function pipelineCurry() {
  const functions = [];

  function curried(func) {
    if (func) {
      functions.push(func);
      return curried;
    }
    return function (initialValue) {
      return functions.reduce((result, currentFunction) => {
        return currentFunction(result);
      }, initialValue);
    };
  }

  return curried;
}

// 示例操作函数
const addOne = (num) => num + 1;
const double = (num) => num * 2;
const subtractThree = (num) => num - 3;

// 使用 pipelineCurry 函数进行柯里化操作
const pipeline = pipelineCurry(addOne)(double)(subtractThree)();

// 传入初始值并执行操作
const result1 = pipeline(5);
console.log(result1);

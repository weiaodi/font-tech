function pipeline(...functions) {
  return function (initialValue) {
    return functions.reduce(function (accumulator, currentFunction) {
      return currentFunction(accumulator);
    }, initialValue);
  };
}

const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;
const addThenMult = pipeline(plus1, mult2);
console.log(addThenMult(5)); // 输出 12
/*

pipeline 函数使用剩余参数语法 ...functions 接收任意数量的函数作为参数，并将它们收集到一个数组 functions 中。
当调用 pipeline(plus1, mult2) 时，functions 数组的值为 [plus1, mult2]。

pipeline 函数返回一个新的函数，这个新函数就是一个闭包，它可以访问 pipeline 函数作用域内的 functions 数组。
虽然 pipeline 函数执行完毕后，其作用域理论上应该被销毁，但由于返回的闭包函数引用了 functions 数组，所以 functions 数组不会被销毁，而是被闭包保留下来。

*/

/*
const pipeline = (...focus) => (val) => focus.reduce((a, b) => b(a), val);

const plus1 = (a) => a + 1;
const mult2 = (a) => a * 2;
const addThenMult = pipeline(plus1, mult2);

addTheMult(5);
12
*/
// 管道函数的应用
// 定义管道函数
const validationPipeline =
  (...validators) =>
  (value) =>
    validators.every((validator) => validator(value));

// 定义一些验证函数
const isNotEmpty = (value) => value.trim() !== '';
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const hasMinLength = (minLength) => (value) => value.length >= minLength;

// 创建表单验证管道
const emailValidation = validationPipeline(isNotEmpty, isEmail, hasMinLength(5));

// 测试验证管道
const emailInput = 'test@example.com';
const isValid = emailValidation(emailInput);
console.log(isValid);

// 定义管道函数，支持异步操作
const asyncPipeline =
  (...functions) =>
  async (initialValue) => {
    let result = initialValue;
    for (const func of functions) {
      result = await func(result);
    }
    return result;
  };

// 模拟异步数据获取和处理函数
const fetchData = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(10), 1000);
  });
const multiplyByTwo = (num) => num * 2;
const addFive = (num) => num + 5;

// 创建异步操作管道
const asyncDataPipeline = asyncPipeline(fetchData, multiplyByTwo, addFive);

// 执行异步管道
asyncDataPipeline().then((finalResult) => {
  console.log(finalResult);
});

// 定义管道函数
const pipelineData =
  (...functions) =>
  (initialValue) =>
    functions.reduce((acc, func) => func(acc), initialValue);

// 定义一些数据处理函数
const toUpperCase = (str) => str.toUpperCase();
const addPrefix = (str) => `Prefix: ${str}`;
const addSuffix = (str) => `${str} - Suffix`;

// 创建一个数据处理管道
const dataPipeline = pipelineData(toUpperCase, addPrefix, addSuffix);

// 应用管道处理数据
const input = 'hello world';
const output = dataPipeline(input);
console.log(output);

// demo Pipeline
const demoPipe =
  (...fns) =>
  (initValue) =>
    fns.reduce((pre, cur) => cur(pre), initValue);

const addPrefix1 = (str) => `Prefix: ${str}`;
const addSuffix1 = (str) => `${str} - Suffix`;
const res = demoPipe(addPrefix1, addSuffix1);
console.log('🚀 ~ res:', res('aodi'));

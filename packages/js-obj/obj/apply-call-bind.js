// 只在function原型链上存在 call bind apply,
// eslint-disable-next-line no-extend-native
Function.prototype.myCall = function (thisArg, ...args) {
  // 判断传入参数不为空,同时将参数进行对象包裹,否则就认为调用方为window
  thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  //   给当前对象添加临时参数,保存当前调用者的this,  在这里就临时改变了调用者this的指向为传入的thisarg
  const fnSymbol = Symbol('fn');
  thisArg[fnSymbol] = this;
  // thisArg.调用函数(args)
  const res = thisArg[fnSymbol](...args);
  //   删除临时变量
  delete thisArg[fnSymbol];
  //   返回 改变了this指向的调用结果
  return res;
};

// eslint-disable-next-line no-extend-native
Function.prototype.myApply = function (thisArg, argsArr) {
  thisArg = thisArg !== undefined && thisArg !== null ? Object(thisArg) : window;
  //   为对象建立临时属性
  const fnSymbol = Symbol('fn');
  // 指向调用 myApply 的函数
  thisArg[fnSymbol] = this;
  if (!Array.isArray(argsArr)) {
    argsArr = argsArr !== undefined && argsArr !== null ? [argsArr] : [];
  }
  const res = thisArg[fnSymbol](...argsArr);
  delete thisArg[fnSymbol];
  return res;
};

// eslint-disable-next-line no-extend-native
Function.prototype.myBind = function (thisArg, ...args) {
  // 保存调用者的指向
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const currentFunction = this;
  return function (...newArgs) {
    currentFunction.apply(thisArg, args.concat(newArgs));
  };
};
// 测试自定义的 myApply 函数
function greet(...message) {
  console.log(`${message}, my name is ${this.name}`);
}

const person = {
  name: 'John',
};

greet.myApply(person, ['aaa', 'aaaa']);
greet.myCall(person, 'Hello', 'aaa');
// 创建一个新的函数，预设部分参数
const newGreet = greet.myBind(person, 'Hello');

// 调用新函数
newGreet('bind');
// 输出: Hello, my name is John

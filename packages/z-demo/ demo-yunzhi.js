/* eslint-disable */
// 1. 实现 Function.prototype.bind
function myBind(fn) {
  let that = this;
  return function (...args) {
    fn.apply(that, args);
  };
}
// 2. 请写出以下结果
fn(); // 输出：2
function fn() {
  console.log(1);
}
fn(); // 输出：2

var fn = 10;

fn(); // 报错：TypeError: fn is not a function
function fn() {
  console.log(2);
}
fn(); // 不会执行（前面已报错）

//   1  1  undefined  2

// 5. 实现一个方法，对object深度克隆
function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let clone = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}
// 6. 用函数实现 new
function MyNew(constructor, ...args) {
  if (typeof constructor !== 'function' || (typeof constructor !== 'object' && constructor === null)) {
    return new Error('type error');
  }
  //   链接原型链到新对象上面
  let newObj = Object.create(constructor.prototype);
  //   执行构造函数
  let res = constructor.apply(newObj, args);
  //   判断构造函数执行结果,如果为对象则返回对象, 如果不是则返回新建造的对象
  if (typeof constructor === 'object' && constructor !== null) {
    return res;
  }
  return newObj;
}
function Demo() {}
let a = new MyNew(Demo(), 'a');

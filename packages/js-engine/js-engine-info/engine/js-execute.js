/* eslint-disable */
function foo(a) {
  let b = 2;

  function c() {}

  let d = function () {};

  b = 3;
}
/** 在进入执行上下文后，这时候的活动对象 AO 是：
 AO = {
  arguments: {
      0: 1,
      length: 1
  },
  a: 1,
  b: undefined,
  c: reference to function() {},
  d: undefined
}

当代码执行完后，这时候的 AO 是：

AO = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 3,
  c: reference to function c(){},
  d: reference to FunctionExpression "d"
}
大致为这几步:
全局执行上下文的变量对象初始化是全局对象
函数执行上下文的变量对象初始化只包括 Arguments 对象
在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
在代码执行阶段，会再次修改变量对象的属性值

 */
// 由多个执行上下文的 变量对象 构成的链表就叫做作用域链。
function foo() {
  function bar() {
    // do something
  }
}
/*
函数创建时，各自的 [[Scopes]] 为：

console.dir(foo);
[[Scopes]]: Scopes[2]
0: Scripts {...}
1: Global {...}

foo.[[Scopes]] = [
  globalContext.VO
];

bar.[[Scopes]] = [
  fooContext.AO,
  globalContext.VO
];
*/

function myNew(constructor, ...args) {
  // 步骤 1：创建新对象
  const obj = {};

  // 步骤 2：链接原型
  obj.__proto__ = constructor.prototype;

  // 步骤 3：绑定 this 并 调用构造函数
  const result = constructor.apply(obj, args);

  // 步骤 4：判断构造函数是否返回了对象,如果无则返回新创建的默认对象.否则返回构造函数创建的对象
  return typeof result === 'object' && result !== null ? result : obj;
}

function Animal(type) {
  this.type = type;
}

const animal = myNew(Animal, 'Cat');
console.log(animal.type); // 'Cat'

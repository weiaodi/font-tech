/* eslint-disable */
let val = 1;
function test() {
  console.log(val);
}
function bar1() {
  let val = 2;
  test();
}

bar1();
/** 
静态作用域执行过程
当执行 test 函数时，先从 test 函数内部查找是否有变量 val，如果没有，就沿定义函数的位置，查找上一层的代码，查找到全局变量 val ，其值为 1。

作用域查找始终从运行时所处的最内层作用域开始查找，逐级向外查找，直到遇见第一个匹配的标识符为止。

无论函数在哪里被调用，无论如何被调用，它的作用域只由函数定义所处的位置决定。
 */

/*
动态作用域执行过程
执行 test 函数，首先从函数内部查询 val 变量，如果没有，就从调用函数的作用域，即 bar 函数的作用域内部查找变量 val，所以打印结果 2
*/
function foo() {
  if (true) {
    var number = 5;
    console.log(number);
  }

  console.log(number);
}

function bar() {
  if (true) {
    let number = 5;
    console.log(number);
  }

  console.log(number);
}

foo(); // 5 和 5
bar(); // 5 和 ReferenceError: number is not defined
// let 声明的变量的作用域只有外层块，而不是整个外层函数。
// var 声明的变量的作用域是整个封闭函数。

// 为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。

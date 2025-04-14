function Person() {
  this.name = 'Alice';
  this.sayHello = function () {
    // 定义一个普通函数
    function delayedGreeting() {
      console.log('Hello, ' + this.name);
    }
    // 调用普通函数
    delayedGreeting();
  };
}

const person = new Person();
person.sayHello();
/*
创建 Person 实例：const person = new Person(); 这行代码创建了一个 Person 类的实例 person，此时 person 对象有一个 name 属性值为 'Alice'，还有一个 sayHello 方法。
调用 sayHello 方法：person.sayHello(); 调用了 person 对象的 sayHello 方法，程序进入 sayHello 方法的函数体内部执行。
定义并调用 delayedGreeting 函数：
在 sayHello 方法内部定义了 delayedGreeting 函数。
接着执行 delayedGreeting();，这是直接调用了 delayedGreeting 函数，并没有将它作为某个对象的方法来调用。

在 JavaScript 里，this 的指向取决于函数的调用方式：

作为对象的方法调用：
如果函数是作为对象的方法调用，比如 obj.method()，那么 this 指向调用该方法的对象 obj。
作为普通函数调用：
当函数作为独立的普通函数调用时，就像这里的 delayedGreeting();，在非严格模式下 this 指向全局对象（浏览器环境中是 window）；在严格模式下 this 是 undefined。

如果想让 delayedGreeting 函数的 this 指向 person 对象，可以将它作为 person 对象的方法调用
function Person() {
    this.name = 'Alice';
    this.sayHello = function() {
        this.delayedGreeting = function() {
            console.log('Hello, ' + this.name);
        };
        this.delayedGreeting();
    };
}

const person = new Person();
person.sayHello();

 */

function Person1() {
  this.name = 'Alice';
  this.sayHello = function () {
    setInterval(function () {
      console.log('Hello, ' + this.name);
    }, 1000);
  };
}
const person1 = new Person1();
person1.sayHello();
/*
这里的回调函数是一个普通函数，在 JavaScript 中，普通函数的 this 指向是根据函数的调用方式来确定的。setInterval 的回调函数是在全局执行上下文中被调用的（在非严格模式下），所以 this 指向全局对象（在浏览器环境中是 window 对象）。由于全局对象通常没有 name 属性，因此 this.name 的值为 undefined。
 */

/*
this 指向的固定化并不是因为箭头函数内部有绑定 this 的机制，实际原因时箭头函数根本没有自己的 this，导致内部的 this 就是外层代码块的 this。正是因为它没有 this，所以不能用作构造函数。

ES6
function foo() {
    setTimeout(() => {
      console.log('id:', this.id);
    }, 100);
  }
  
  ES5
  function foo() {
    var _this = this;
  
    setTimeout(function () {
      console.log('id:', _this.id);
    }, 100);
  }
*/

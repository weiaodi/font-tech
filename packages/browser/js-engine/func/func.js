// 参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。
let x = 99;
function fn(p = x + 1) {
  console.log(p);
}

fn();
// 100

x = 100;
fn();
// 101

const foo = {
  set current(name) {
    this.log.push(name);
  },
  log: [],
};

foo.current = 'EN';

console.log(foo.log);
// ['EN']

foo.current = 'ZN';

console.log(foo.log);
// ['EN', 'ZN']

/* 
bind() 最简单的用法是创建一个函数，使这个函数不论怎么调用都有同样的 this 值。JavaScript 新手经常犯的一个错误是将一个方法从对象中拿出来，然后再调用，希望方法中的 this 是原来的对象（比如在回调中传入这个方法）。如果不做特殊处理的话，一般会丢失原来的对象。从原来的函数和原来的对象创建一个绑定函数，则能很漂亮地解决这个问题。
*/
this.x1 = 9;

let module = {
  x1: 8,
  getX() {
    return this.x1;
  },
};

module.getX(); // return 8

let retrieveX = module.getX;
retrieveX(); // return 9

let boundGetX = retrieveX.bind(module);
boundGetX(); // return 8

//

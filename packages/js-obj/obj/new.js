function myNew(constructor, ...args) {
  // 对构造函数做类型判断
  if (Object.prototype.toString.call(constructor) !== '[object Function]') {
    throw TypeError(constructor + '非构造函数');
  }
  //  创建一个新对象,将新对象的原型链接到构造函数的原型对象上
  let newObj = Object.create(constructor.prototype);
  const res = constructor.apply(newObj, args);
  return typeof res === 'object' && res !== null ? res : newObj;
}

// 测试用的构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 使用自定义的 myNew 函数创建对象
const person = myNew(Person, 'John', 30);

console.log(person);

function myNew(constructor, ...args) {
  const newObj = Object.create(constructor.prototype);
  const result = constructor.apply(newObj, args);
  return typeof result === 'object' && result !== null ? result : newObj;
}

// 测试用的构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 使用自定义的 myNew 函数创建对象
const person = myNew(Person, 'John', 30);

console.log(person.name);
// 输出: John
console.log(person.age);
// 输出: 30

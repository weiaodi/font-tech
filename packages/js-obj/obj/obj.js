let Person = {
  name: 'jhon',
  age: 22,
  children: [{ age: 22, id: 33 }],
};
for (const key in Person) {
  // 调用对象原型上的 hasOwnProperty方法 避免命名冲突问题
  if (Object.prototype.hasOwnProperty.call(Person, key)) {
  }
}
const obj = {};
Object.defineProperty(obj, 'name', {
  value: 'John',
  configurable: false,
});

const result = Reflect.deleteProperty(obj, 'name');
console.log(result);
// 输出: false，因为属性不可配置，无法删除
console.log(obj);
// 输出: { name: 'John' }

const obj1 = { a: 1, b: 2 };
// 获取对象的键值对
Object.entries(obj).forEach(([key, value]) => console.log(key + ': ' + value));
// 获取对象的键
Object.keys(obj1).forEach((key) => console.log(key + ': ' + obj[key]));
// in 操作符 判断对象是否含有一个属性
console.log('a' in obj);
// 输出: true
console.log('toString' in obj);
// 输出: true，因为 'toString' 是继承属性
// hasOwnProperty();  方法获得对象非原型链上的属性。

// 有时候，我们想要判断对象自身中是否具有指定的属性，而不是从原型中继承来的属性，这时可以使用hasOwnProperty() 方法。
function iterate(obj) {
  let res = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      res.push(key + ': ' + obj[key]);
    }
  }
  return res;
}

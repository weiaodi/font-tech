// 举例使用 for in 和 entries,keys,values
// eslint-disable-next-line max-classes-per-file
class Animal {
  constructor(name) {
    this.name = name;
  }
}
class Pig extends Animal {
  constructor(name, action) {
    super(name);
    this.action = action;
  }
}
// sound：这是 Animal 对象原型链上的可枚举属性,非实例对象的。
Animal.prototype.sound = 'Roar';
Pig.prototype.jump = 'iump';
const p = new Pig('偷吃');
// 返回**自身可枚举属性**的键数组（不包含继承属性）。
let keysp = Object.keys(p);
let valuesp = Object.values(p);
let enumable = Object.entries(p);
//

console.log('🚀 ~ enumable:', keysp, valuesp);
console.log('🚀 ~ enumable:', enumable);

// 会获取对象和原型链的所有可枚举属性
for (const key in p) {
  console.log('🚀 ~ 11111key:', key);
}
// 如果想只获取当前对象的所有可枚举属性
for (const key in p) {
  if (Object.prototype.hasOwnProperty.call(p, key)) {
    console.log('🚀 ~ key objOwn:', key);
  }
}

console.log('🚀 ~ Object.getOwnPropertyNames(p):', Object.getOwnPropertyNames(p));

const obj = {
  a: 1,
  b: 2,
  c: 111,
};
Object.defineProperty(obj, 'c', {
  value: 3,
  enumerable: false, // 不可枚举
});
for (const key in obj) {
  console.log('🚀 ~ key objOwn:', key);
}

console.log(Object.getOwnPropertyNames(obj)); // ['a', 'b', 'c']
console.log(Object.keys(obj)); // ['a', 'b']（仅可枚举属性）

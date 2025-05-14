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
const a = new Animal('测试宠物');
const p = new Pig('偷吃');
// 只会获取可枚举的属性
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

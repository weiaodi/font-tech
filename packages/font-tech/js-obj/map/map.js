const cache = new Map();
function caculatedSquare(num) {
  if (cache.has(num)) {
    console.log('🚀 ~ 拿缓存', cache);

    return cache.get(num);
  }
  const res = num * num;
  cache.set(num, res);
  console.log('🚀 ~ 计算结果', cache);
  return res;
}

console.log(caculatedSquare(5));
console.log(caculatedSquare(5));
console.log(caculatedSquare(15));
console.log(caculatedSquare(125));
console.log('🚀 ~ cache:', cache.values());
for (const element of cache.values()) {
  console.log('🚀 ~ element:', element);
}
for (const element of cache.keys()) {
  console.log('🚀 ~ element:', element);
}

// 默认调用.entries()方法
for (const element of cache.entries()) {
  console.log('🚀 ~ element:', element);
}
for (const element of cache) {
  console.log('🚀 ~ element:', element);
}

const weakMap = new WeakMap();
let obj = { id: 1 };

weakMap.set(obj, 'some value');
console.log(weakMap.get(obj)); // 输出 'some value'
obj = null; // 删除对象的其他引用
// 在此之后，obj 被垃圾回收，WeakMap 中的键值对也会被清除
console.log(weakMap.get(obj)); // 输出 'some value'

// 定义一个构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在原型上添加一个可枚举属性
Person.prototype.gender = 'unknown';

/**
 *可迭代对象是指实现了 Symbol.iterator 方法的对象。这个 Symbol.iterator 是 JavaScript 中的一个内置符号，当一个对象拥有 Symbol.iterator 方法时，就表明它是可迭代的。Symbol.iterator 方法必须返回一个迭代器对象，迭代器对象是一个具有 next() 方法的对象，next() 方法返回一个包含 value 和 done 两个属性的对象。

 */
// 迭代器的使用
// 1.基本使用
let fruits = ['Banana', 'Orange', 'Apple', 'Mango'];
const iterator = fruits[Symbol.iterator]();
const iterator1 = fruits[Symbol.iterator]();
// 手动调用迭代器
let result = iterator.next();
console.log('🚀 ~ result:', result);

while (!result.done) {
  console.log(result.value, result);
  result = iterator.next();
}
// for...of 循环遍历 iterator，循环会自动处理 next() 方法的调用和 done 属性的判断。
for (const i of iterator1) {
  console.log('🚀 ~ i:', i);
}
//
class MyCollection {
  items;
  constructor(items) {
    this.items = items;
  }
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        console.log('🚀 ~ MyCollection ~ next ~ index:', index);
        if (index < this.items.length) {
          return { value: this.items[index++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

let demo = new MyCollection([1, 2, 3, 4, 5, 2, 6, 7, 1]);
for (const id of demo) {
}
const demo1 = {
  items: [1, 2, 3, 4, 5, 2, 6, 7, 1],
  [Symbol.iterator]() {
    let index = 0;

    return {
      next: () => {
        console.log('1', index);
        if (index < this.items.length) {
          return { value: this.items[index++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};
for (const id of demo1) {
}

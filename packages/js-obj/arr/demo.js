class Demo {
  constructor(items = []) {
    this.items = items;
    console.log('🚀 ~ Demo ~ constructor ~ items:', this.items);
  }
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => {
        console.log('🚀 ~ Demo ~ constructor ~ items:', this.items);
        if (i < this.items.length) {
          return { value: this.items[i], done: false };
        }
        return { value: null, done: true };
      },
    };
  }
}
let demo = new Demo([1, 2, 3, 4, 5]);
const iterator = demo[Symbol.iterator]();
let res = iterator.next();
while (!res.done) {
  console.log('🚀 ~ res:', res);
  res = iterator.next();
}

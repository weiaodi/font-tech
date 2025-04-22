const target = {
  value: 10,
};
let demo1 = null;
let demo2 = null;
const handler = {
  get(target, property, receiver) {
    if (demo1) {
      demo2 = receiver;
    } else {
      demo1 = receiver;
    }
    return target[property];
  },
};

const proxy = new Proxy(target, handler);
class SubClass {
  constructor() {
    Object.setPrototypeOf(this, proxy);
  }
}

const subInstance = new SubClass();
console.log(proxy.value, demo1);
console.log(subInstance.value, demo2);

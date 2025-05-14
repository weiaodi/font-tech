const name = '全局作用域';
// 对象本身不算做一个作用域,
const person = {
  name: 'Alice',
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  },
  sayHello1: () => {
    console.log(`Hello, I'm ${this.name}`);
  },
};
person.sayHello();
person.sayHello1();
// 实现一个计算器函数,可以进行链式调用,最终给出结果
function caculate(nums) {
  const process = {
    res: nums,
    minus(params) {
      this.res -= params;
      return this;
    },
    plus(params) {
      this.res += params;
      return this;
    },
    result() {
      return this.res;
    },
  };
  return process;
}

console.log('🚀 ~ caculate().minus(2).plus(3).result():', caculate(1).minus(2).plus(3).result());

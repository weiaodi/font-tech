// 级联函数
function Person() {
  this.name = '';
  this.age = 0;
  this.weight = 10;
}

Person.prototype = {
  setName(name) {
    this.name = name;
    return this;
  },
  setAge(age) {
    this.age = age;
    return this;
  },
  setWeight(weight) {
    this.weight = weight;
    return this;
  },
};

let uzi = new Person();

uzi.setName('Uzi').setAge(22).setWeight(160);

console.log(uzi);
// { name: "Uzi", age: 22, weight: 160 }

// 回调函数
let obj = {
  sum: 0,
  add(num1, num2) {
    this.sum = num1 + num2;
  },
};
// 在这块 obj.add 赋值给 callback 这个情况下  this的调用情况是全局调用
function add(num1, num2, callback) {
  callback(num1, num2);
}

add(1, 2, obj.add);

console.log(obj.sum);
// 0

console.log(window.sum);
// 3

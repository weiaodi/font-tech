// object 静态方法
let person = {
  a: 'qqq',
  b: [1, 2, 3],
  c: 'demo',
};
let numObj = Object(30);
// 包装为对象类型,但是仍然具有数字类型的方法
console.log('🚀 ~ numObj:', numObj, numObj.valueOf());
for (const element of Object.entries(person)) {
  console.log('🚀 ~ element:', element);
}
for (const element of Object.keys(person)) {
  console.log('🚀 ~ element:', element);
}

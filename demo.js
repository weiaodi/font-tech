let a = 'hi, my name is {name}, I am {age} years old, my email is {email}.';
let b = { name: 'max', age: 12, email: 'max@gmail.com' };
// 实现这个方法
function replace(tpl, data) {
  return tpl.replace(/\{([^{}]+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
}
console.log('🚀 ~ replace(a, b):', replace(a, b));
let ss = 'demo';

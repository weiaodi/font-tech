// 惰性函数
/* 
function addEvent(type, element, func) {
    if (element.addEventListener) {
      addEvent = function (type, element, func) {
        element.addEventListener(type, func, false);
      }
    } else if(element.attachEvent){
      addEvent = function (type, element, func) {
        element.attachEvent('on' + type, func);
      }
    } else{
      addEvent = function (type, element, func) {
        element['on' + type] = func;
      }
    }
  
    return addEvent(type, element, func);
  }
 */

// 定义一个计算斐波那契数列的惰性函数
const fibonacci = (function () {
  // 用于存储已经计算过的斐波那契数列值
  const memo = {};

  return function (n) {
    console.log(`当前 memo 的状态:`, memo);
    // 检查是否已经计算过该值
    if (memo[n] !== undefined) {
      console.log(`已经计算过 fibonacci(${n})，直接返回缓存值:`, memo[n]);
      return memo[n];
    }

    if (n === 0 || n === 1) {
      memo[n] = n;
      console.log(`计算 fibonacci(${n})，结果为:`, n);
      return n;
    }

    // 计算当前值并存储到 memo 中
    memo[n] = fibonacci(n - 1) + fibonacci(n - 2);
    console.log(`计算 fibonacci(${n})，结果为:`, memo[n]);
    return memo[n];
  };
})();

// 测试示例
console.log('第一次调用 fibonacci(5)');
console.log(fibonacci(5));

console.log('第二次调用 fibonacci(5)');
console.log(fibonacci(5));

console.log('调用 fibonacci(8)');
console.log(fibonacci(8));

console.log('再次调用 fibonacci(8)');
console.log(fibonacci(8));
/* 
使用 ! 运算符将函数定义转换为表达式
!function() {
    console.log('使用 ! 实现 IIFE');
}(); 

使用 + 运算符将函数定义转换为表达式
+function() {
    console.log('使用 + 实现 IIFE');
}(); 
*/

// 模拟一个异步请求函数
function asyncRequest(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`发起请求，id 为 ${id}`);
      resolve({ id, data: `数据-${id}` });
    }, 1000);
  });
}

// 使用惰性函数缓存请求结果
const cachedRequest = (function () {
  const cache = {};
  return async function (id) {
    if (cache[id]) {
      console.log(`从缓存中获取 id 为 ${id} 的数据`);
      return cache[id];
    }
    const result = await asyncRequest(id);
    cache[id] = result;
    console.log(`将 id 为 ${id} 的数据存入缓存`);
    return result;
  };
})();

// 测试调用
(async () => {
  const result1 = await cachedRequest(1);
  console.log('第一次调用结果:', result1);

  const result2 = await cachedRequest(1);
  console.log('第二次调用结果:', result2);

  const result3 = await cachedRequest(2);
  console.log('第三次调用结果:', result3);
})();

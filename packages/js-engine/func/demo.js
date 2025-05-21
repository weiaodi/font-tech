/* 
 实现 
懒加载函数:
1斐波那契数量求和,
2缓存promise结果,
 */
// 1
const fibSum = (() => {
  const cache = new Map();
  return (n) => {
    if (!Number.isInteger(n)) {
      throw new Error('type error');
    }
    //
    if (n === 1 || n == 0) {
      cache.set(n, n);
      return n;
    }
    if (cache.has(n)) {
      console.log('🚀 ~ 缓存中取', cache.get(n));
      return cache.get(n);
    }
    const sum = fibSum(n - 1) + fibSum(n - 2);
    cache.set(n, sum);
    // 第一次计算结果
    console.log('🚀 ~ 第一次计算结果', cache.get(n));
    return sum;
  };
})();

// console.log('🚀 ~ fibSum(10):', fibSum(3));
// console.log('🚀 ~ fibSum(10):', fibSum(3));

// 2缓存promise结果
const req = async () =>
  new Promise((resolve, rejcet) => {
    setTimeout(() => {
      resolve('请求结果');
    }, 1000);
  });
const req1 = async () =>
  new Promise((resolve, rejcet) => {
    setTimeout(() => {
      resolve('请求结果1');
    }, 1000);
  });
const cacheFn = (() => {
  const cache = new Map();
  return async (fn) => {
    if (cache.has(fn)) {
      console.log('🚀 ~ 缓存中取', cache.get(fn));
      return cache.get(fn);
    }
    const res = await fn();
    cache.set(fn, res);
    console.log('🚀 ~ 第一次计算结果', cache.get(fn));
    return res;
  };
})();
cacheFn(req1);
cacheFn(req);
setTimeout(() => {
  cacheFn(req);
}, 2000);

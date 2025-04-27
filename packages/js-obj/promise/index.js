function customPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    // 用于存储每个 Promise 的结果
    const results = [];
    // 记录已经完成的 Promise 数量
    let completedCount = 0;

    // 如果传入的 promises 为空数组，直接 resolve 一个空数组
    if (promises.length === 0) {
      resolve(results);
      return;
    }

    // 遍历传入的 promises 数组
    promises.forEach((promise, index) => {
      // 将每个元素转换为 Promise 对象
      Promise.resolve(promise)
        .then((value) => {
          // 将结果存储到对应的索引位置
          results[index] = value; // 完成的 Promise 数量加 1
          completedCount++;
          // 当所有 Promise 都完成时，resolve 结果数组
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          // 只要有一个 Promise 被拒绝，就 reject 整个结果
          reject(error);
        });
    });
  });
}

// 使用示例
const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 1000);
});
const promise3 = Promise.resolve(3);

customPromiseAll([promise1, promise2, promise3])
  .then((values) => {
    console.log(values); // 输出: [1, 2, 3]
  })
  .catch((error) => {
    console.error(error);
  });

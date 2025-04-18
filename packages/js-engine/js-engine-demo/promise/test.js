const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});
const promise1 = Promise.resolve(2);

function customPromiseAll(promiseArr) {
  return new Promise((resolve, reject) => {
    // 最终返回一个执行结果的数组
    let result = [];
    let count = 0;
    if (!Array.isArray(promiseArr) || promiseArr.length === 0) {
      resolve([]);
    }
    promiseArr.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          // 保证他的顺序传入
          result[index] = value;
          count++;
          // 判断是否所有的promise完成了
          if (count === promiseArr.length) {
            resolve(result);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    });
  });
}
customPromiseAll([promise1, promise])
  .then((values) => {
    console.log(values);
  })
  .catch((error) => {
    console.error(error);
  });

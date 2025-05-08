function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    let resultList = [];
    if (promises.length === 0) {
      resolve(resultList);
    }
    let count = 0;
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((res) => {
          resultList[index] = res;
          count++;
          if (count === promises.length) {
            resolve(resultList);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

const promise1 = Promise.resolve(1);
const promise2 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 1000);
});
const promise3 = Promise.resolve(3);

myPromiseAll([promise1, promise2, promise3])
  .then((values) => {
    console.log(values); // 输出: [1, 2, 3]
  })
  .catch((error) => {
    console.error(error);
  });

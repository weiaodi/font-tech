function mapAsync(array, asyncCallback) {
  const promises = array.map((item) => {
    return asyncCallback(item);
  });
  return Promise.all(promises);
}

// 调用示例
mapAsync(
  [1, 2, 3],
  (item) =>
    new Promise((resolve) => {
      const time = (3 - item) * 1000;
      setTimeout(() => {
        console.log(item);
        resolve(time);
      }, time);
    }),
).then(console.log);

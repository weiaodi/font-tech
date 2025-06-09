function myAsync(gen) {
  // 在函数内部自动执行迭代器同时返回promise对象
  return function () {
    return new Promise((resolve, reject) => {
      // 获取迭代器
      let g = gen();
      const next = (context) => {
        let res;
        try {
          res = g.next(context);
        } catch (error) {
          reject(error);
        }
        if (res.done) {
          resolve(res.value);
        } else {
          Promise.resolve(res.value).then(
            (value) => {
              // 将第一次执行的结果数值传回给next中
              /* 
let res1 = yield getFetch(1);
let res2 = yield getFetch(res1);
            */
              next(value);
            },
            (error) => {
              next(error);
            },
          );
        }
      };
      next();
    });
  };
}

const getFetch = (nums) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(nums + 1);
    }, 1000);
  });

function* gen() {
  let res1 = yield getFetch(1);
  let res2 = yield getFetch(res1);
  let res3 = yield getFetch(res2);
  return res3;
}

const asyncGen = myAsync(gen);
asyncGen().then((res) => {
  console.log(res);
}); // 4

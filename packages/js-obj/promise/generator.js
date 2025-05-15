function muYouAsync(gen) {
  // 接受一个Generator函数作为参数
  // 返回一个函数
  return function () {
    // 返回一个promise
    return new Promise((resolve, reject) => {
      // 执行Generator函数
      let g = gen();
      const next = (context) => {
        let res;
        try {
          res = g.next(context);
        } catch (error) {
          reject(error);
        }
        if (res.done) {
          // 这时候说明已经是完成了，需要返回结果
          resolve(res.value);
        } else {
          // 继续执行next函数,传入执行结果
          return Promise.resolve(res.value).then(
            (val) => next(val),
            (err) => next(err),
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

const asyncGen = muYouAsync(gen);
asyncGen().then((res) => {
  console.log(res);
}); // 4

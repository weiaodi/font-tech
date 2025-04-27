// 模拟异步操作
function asyncTask(delay, value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, delay);
  });
}

// 生成器函数
function* generate() {
  const result1 = yield asyncTask(1000, 'First task completed');
  console.log(result1);
  const result2 = yield asyncTask(1500, 'Second task completed');
  console.log(result2);
  return 'All tasks completed';
}
// 创建生成器实例
const iterator = generate();
let iteration = iterator.next();

while (!iteration.done) {
  console.log(iteration);
  // 处理异步任务结果
  iteration = iterator.next();
}
// 执行器函数，模拟 async/await 行为
function runGenerator(gen) {
  const iterator = gen();

  function iterate(iteration) {
    if (iteration.done) {
      return Promise.resolve(iteration.value);
    }

    const promise = iteration.value;
    return promise
      .then((result) => {
        return iterate(iterator.next(result));
      })
      .catch((error) => {
        return iterate(iterator.throw(error));
      });
  }

  return iterate(iterator.next());
}

// 调用执行器函数来运行生成器
runGenerator(generate).then((finalResult) => {
  console.log(finalResult);
});

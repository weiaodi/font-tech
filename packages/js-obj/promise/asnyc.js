// 模拟异步操作
function asyncTask(delay, value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, delay);
  });
}

// 使用 async/await 实现异步操作
async function asyncFunction() {
  try {
    const result1 = await asyncTask(1000, 'First task completed');
    console.log(result1);
    const result2 = await asyncTask(1500, 'Second task completed');
    console.log(result2);
    return 'All tasks completed';
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// 调用 async 函数
asyncFunction().then((finalResult) => {
  console.log(finalResult);
});

async function main() {
  const finalResult = await asyncFunction();
  console.log(finalResult);
}
main();

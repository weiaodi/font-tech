//
async function asyncTask() {
  console.log('1. 进入 asyncTask');
  const result = await Promise.resolve('结果');
  console.log('3. 拿到结果:', result);
}

console.log('0. 开始执行');
asyncTask();
console.log('2. 同步代码继续');

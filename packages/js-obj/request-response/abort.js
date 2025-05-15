function longRunningTask(signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve('任务完成');
    }, 10000);

    // 监听取消信号
    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId); // 清理资源
      reject(new Error('任务被取消'));
    });
  });
}

const controller = new AbortController();
longRunningTask(controller.signal)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

// 3 秒后取消任务
setTimeout(() => controller.abort(), 3000);

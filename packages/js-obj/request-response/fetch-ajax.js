const timeout = (ms) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });

fetch('https://api.example.com/data')
  .then((response) => response.json())
  .catch((error) => {
    if (error.message === '请求超时') {
      // 处理超时逻辑
    }
  });

// 并发超时 Promise 和 fetch Promise
Promise.race([fetch('demo'), timeout(3000)]);
//
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then((response) => response.json())
  .catch((error) => {
    if (error.name === 'AbortError') {
      console.log('请求已取消');
    }
  });

// 5 秒后取消请求
setTimeout(() => controller.abort(), 5000);

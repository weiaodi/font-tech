// 1.监听主线程发过来的数据
onmessage = function (e) {
  console.log('Worker: Message received from main script', e);
  const result = e.data[0] * e.data[1];
  if (Number.isNaN(result)) {
    // 2.给主线程发送数据
    postMessage('Please write two numbers');
  } else {
    const workerResult = 'Result: ' + result;
    console.log('Worker: Posting message back to main script');
    postMessage(workerResult);
  }
};

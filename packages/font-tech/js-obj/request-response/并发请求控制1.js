function concurRequest(urls, maxNum) {
  if (urls.length === 0) {
    return Promise.resolve([]);
  }
  return new Promise((resolve) => {
    let nextIndex = 0;
    let finishCount = 0;
    const result = [];

    async function _request() {
      if (nextIndex >= urls.length) {
        return;
      }
      const i = nextIndex;
      const url = urls[nextIndex++];
      // await 影响的只有 async范围内的函数,在该函数内,后序的步骤执行都是在微任务队列中
      const resp = await fetch(url);
      result[i] = resp;
      finishCount++;
      if (finishCount === urls.length) {
        resolve(result);
      }
      _request();
    }

    for (let i = 0; i < Math.min(maxNum, urls.length); i++) {
      _request();
    }
  });
}

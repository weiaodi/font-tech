/* eslint-disable no-var */
function fetchResource(url, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      url.includes('fail') ? reject() : resolve(url);
    }, delay);
  });
}

// 原始有问题的函数
function loadRescoure(urls) {
  return new Promise((resolve) => {
    const urlsRes = [];
    let complete = 0;
    // 只有当前声明的变量是 var才行, 如果改成let 因为块级作用域的存在,每次拿到的都是正确的i数值
    // eslint-disable-next-line vars-on-top
    for (var i = 0; i < urls.length; i++) {
      // 让索引大的请求先完成（逆序）
      fetchResource(urls[i], (urls.length - i) * 1000)
        // eslint-disable-next-line no-loop-func
        .then((res) => {
          urlsRes[i] = res;
          complete++;
          if (complete === urls.length) {
            resolve(urlsRes);
          }
        })
        // eslint-disable-next-line no-loop-func
        .catch(() => {
          urlsRes[i] = '';
          complete++;
          if (complete === urls.length) {
            resolve(urlsRes);
          }
        });
    }
  });
}

// 修复后的函数（IIFE）
function loadRescoure1(urls) {
  return new Promise((resolve) => {
    const urlsRes = [];
    let complete = 0;

    for (let i = 0; i < urls.length; i++) {
      // eslint-disable-next-line no-loop-func
      (function (index) {
        fetchResource(urls[index], (urls.length - index) * 1000)
          .then((res) => {
            urlsRes[index] = res;
          })
          .catch(() => {
            urlsRes[index] = '';
          })
          .finally(() => {
            complete++;
            if (complete === urls.length) {
              resolve(urlsRes);
            }
          });
      })(i);
    }
  });
}

// 修复后的函数（闭包）
function loadRescoure2(urls) {
  return new Promise((resolve) => {
    const urlsRes = [];
    let complete = 0;

    function load(index) {
      fetchResource(urls[index], (urls.length - index) * 1000)
        .then((res) => {
          urlsRes[index] = res;
        })
        .catch(() => {
          urlsRes[index] = '';
        })
        .finally(() => {
          complete++;
          if (complete === urls.length) {
            resolve(urlsRes);
          }
        });
    }

    for (let i = 0; i < urls.length; i++) {
      // 增加延迟，禁用引擎优化
      setTimeout(() => load(i), 100 * i);
    }
  });
}

// 测试用例
(async () => {
  const testUrls = [
    'https://example.com/a', // 延迟3000ms
    'https://example.com/fail', // 延迟2000ms
    'https://example.com/c', // 延迟1000ms
  ];

  console.log('预期结果:', ['https://example.com/a', '', 'https://example.com/c']);

  try {
    const result = await loadRescoure(testUrls);
    console.log('loadRescoure结果:', result);
  } catch (error) {
    console.log('loadRescoure错误:', error);
  }

  try {
    const result1 = await loadRescoure1(testUrls);
    console.log('loadRescoure1结果:', result1);
  } catch (error) {
    console.log('loadRescoure1错误:', error);
  }

  try {
    const result2 = await loadRescoure2(testUrls);
    console.log('loadRescoure2结果:', result2);
  } catch (error) {
    console.log('loadRescoure2错误:', error);
  }
})();

// 定义一个执行函数
function eliminateAsync(func) {
  let i = 0;
  let cache = []; // 用于缓存数据
  let _originMain = main; // 把异步函数赋值到一个变量供后面执行
  window.main = (...arg) => {
    // 重新定义异步函数
    // 判断缓存中有没有数据，第一次肯定没有
    if (cache[i]) {
      // 如果有缓存数据
      // 如果状态是fulfilled的，就返回缓存数据
      if (cache[i].status === 'fulfilled') {
        return cache[i].data;
      }
      // 如果异步函数执行错误了就返回错误信息
      throw cache[i].error;
    }
    let result = {
      status: 'pending',
      data: null,
      error: null,
    };
    // 保存缓存信息，第一次缓存数据是假缓存
    cache[i++] = result;
    // 执行一函数，第一次不等待函数执行完，执行下面的抛出错误 throw pro
    let pro = _originMain(...arg).then(
      (resp) => {
        // 把数据缓存起来
        result.status = 'fulfilled';
        result.data = resp;
      },
      (err) => {
        // 把错误数据缓存起来
        result.status = 'rejected';
        result.error = err;
      },
    );
    throw pro;
  };
  try {
    func();
  } catch (err) {
    if (err instanceof Promise) {
      const reRun = () => {
        // i代表某一次运行中调用fetch的次数,因为他为纯函数,所有后序调用都是命中缓存的
        i = 0;
        func();
      };
      // 接收到抛出的错误后，再等待异步函数执行完成后重新运行传进来的函数，下次运行
      // 就能拿到缓存的数据了，因为异步函数已经执行完毕，缓存已经保存了
      err.then(reRun, reRun);
    }
  }
}
function main() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('收到反馈和案说法');
    }, 1000);
  });
}
function f1() {
  return main();
}
function f2() {
  console.log(11); // 其实你会发现这个打印执行了2次，明白其中道理就会知道为什么会打印2次
  let user = f1();
  console.log(user);
}

eliminateAsync(f2); // 一秒过后打印 ‘收到数据并返回信息’

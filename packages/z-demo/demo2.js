//  节流 一段时间内只允许执行一次
function throttle(fn, wait = 500) {
  let time = null;
  return function (...args) {
    if (time === null) {
      time = setTimeout(() => {
        fn.apply(this, args);
        time = null;
      }, wait);
    }
  };
}

// 使用示例
function exampleFunction(a) {
  console.log('Function called' + a);
}

const throttledFunction = throttle(exampleFunction, 1000);

// 模拟多次调用
setInterval(throttledFunction, 200);

// 防抖  函数执行一次后,一段时间后触发,如果该段时间内如果再次触发则重新计时
function debounce(fn, interval = 500) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, interval);
  };
}

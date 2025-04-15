//  节流 一段时间内只允许执行一次
function throttle(fn, wait = 500) {
  let timer = null;
  return function (...args) {
    // 判断当前定时器是否存在
    if (!timer) {
      fn.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
      }, wait);
    }
  };
}

// 使用示例
function exampleFunction() {
  console.log('Function called');
}

const throttledFunction = throttle(exampleFunction, 1000);

// 模拟多次调用
setInterval(throttledFunction, 200);

// 防抖  函数执行一次后,一段时间后触发,如果该段时间内如果再次触发则重新计时
function debounce(fn, interval = 500, immediate = false) {
  let timer = null;
  return function (...args) {
    if (immediate) {
      fn.apply(this.args);
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, interval);
  };
}

function plus1(a, b, c) {
  return a + b + c;
}
function partial(fn, ...args) {
  return function (...newArgs) {
    fn.apply(this, args.concat(newArgs));
  };
}

// 使用 partial 函数创建偏函数
const addWithFive = partial(plus1, 5);

// 调用偏函数
console.log(addWithFive(3, 2));
// 占位符版本
const _ = {};

const partial1 = (fn, ...args) => {
  return (...newArgs) => {
    let position = 0;
    const newArgsCopy = [...args];
    for (let i = 0; i < newArgsCopy.length; i++) {
      if (newArgsCopy[i] === _) {
        newArgsCopy[i] = newArgs[position++];
      }
    }
    while (position < newArgs.length) {
      newArgsCopy.push(newArgs[position++]);
    }
    return fn.apply(this, newArgsCopy);
  };
};
function add(a, b, c) {
  return a + b + c;
}

const addWithPlaceholder = partial1(add, _, 2, _);
console.log(addWithPlaceholder(1, 3));

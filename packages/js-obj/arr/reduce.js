/* eslint-disable no-extend-native */
Array.prototype.myReduce = function (_fn, _initvalue) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const arr = this;
  let accumulator = _initvalue;
  let start = 0;
  // 无初始数值同时数组长度为0报错
  if (_initvalue === undefined) {
    if (arr.length === 0) {
      throw new Error('input error');
    }
    accumulator = arr[0];
    start = 1;
  }
  for (let index = start; index < arr.length; index++) {
    accumulator = _fn(accumulator, arr[index], index, arr);
  }
  return accumulator;
};
let arr = [1, 1, 1];
let res = arr.myReduce((pre, cur) => {
  return pre + cur;
}, 1);
console.log('🚀 ~ res ~ res:', res);

/*
 * @lc app=leetcode.cn id=66 lang=javascript
 *
 * [66] 加一
 */

// @lc code=start
/**
 * @param {number[]} digits
 * @return {number[]}
 */
let plusOne = function (digits) {
  for (let index = digits.length - 1; index >= 0; index--) {
    if (digits[index] < 9) {
      digits[index]++;
      return digits;
    }
    digits[index] = 0;
  }
  return [1, ...digits];
};
// @lc code=end

let plusOne2 = function (digits) {
  //  转化类型,再转化为数组
  let num = BigInt(digits.join(''));
  num++;
  return num.toString().split('').map(Number);
};
let plusOne1 = function (digits) {
  // 考虑合成数组的范围故采用bigint
  let num = BigInt(digits.join(''));
  num++;
  //   进行取模运算来将数字转化为数组
  let result = [];
  while (num > 0) {
    // 考虑类型一致
    result.unshift(num % BigInt(10));
    num /= BigInt(10);
  }
  //   将每个元素转化为int类型
  return result.map((bigIntValue) => Number(bigIntValue));
};

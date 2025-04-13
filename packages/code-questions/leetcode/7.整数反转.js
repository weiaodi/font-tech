/*
 * @lc app=leetcode.cn id=7 lang=javascript
 *
 * [7] 整数反转
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
let reverse = function (x) {
  const MAX_INT = 2147483647;
  const MIN_INT = -2147483648;
  let reversed = 0;
  let isNegative = x < 0;
  x = isNegative ? -x : x;
  while (x !== 0) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  // 再次检查最终结果是否溢出
  if (reversed < MIN_INT || reversed > MAX_INT) {
    return 0;
  }

  return isNegative ? -reversed : reversed;
};
// @lc code=end

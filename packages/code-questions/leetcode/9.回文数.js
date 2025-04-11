/*
 * @lc app=leetcode.cn id=9 lang=javascript
 *
 * [9] 回文数
 */

// @lc code=start
/**
 * @param {number} x
 * @return {boolean}
 */
let isPalindrome = function (x) {
  if (x < 0 || (x !== 0 && x % 10 === 0)) {
    return false;
  }
  let halfRight = 0;
  while (halfRight < x) {
    halfRight = halfRight * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return halfRight === x || Math.floor(halfRight / 10) === x;
};
// @lc code=end

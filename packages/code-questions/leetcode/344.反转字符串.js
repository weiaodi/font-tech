/*
 * @lc app=leetcode.cn id=344 lang=javascript
 *
 * [344] 反转字符串
 */

// @lc code=start
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
let reverseString = function (s) {
  //  左右指针从数组边界开始调整字符串
  let left = 0,
    right = s.length - 1;
  let chars = s.split('');
  while (left < right) {
    left++;
    right--;
  }
};
// @lc code=end

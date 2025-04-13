/*
 * @lc app=leetcode.cn id=541 lang=javascript
 *
 * [541] 反转字符串 II
 */

// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
let reverseStr = function (s, k) {
  // 0-2k
  let charArr = s.split('');
  for (let i = 0; i < charArr.length; i += k * 2) {
    let left = i,
      right = Math.min(i + k - 1, charArr.length - 1);
    while (left < right) {
      [charArr[left], charArr[right]] = [charArr[right], charArr[left]];
      left++;
      right--;
    }
  }
  return charArr.join('');
};
// @lc code=end

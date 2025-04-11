/*
 * @lc app=leetcode.cn id=557 lang=javascript
 *
 * [557] 反转字符串中的单词 III
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
let reverseWords = function (s) {
  let charArr = s.split('');
  let start = 0;
  for (let i = 0; i <= charArr.length; i++) {
    // 以 空字符为或者最后一个元素为边界
    if (i === charArr.length || charArr[i] === ' ') {
      let left = start,
        right = i - 1;
      while (left < right) {
        [charArr[left], charArr[right]] = [charArr[right], charArr[left]];
        left++;
        right--;
      }
      start = i + 1;
    }
  }
  return charArr.join('');
};
// @lc code=end

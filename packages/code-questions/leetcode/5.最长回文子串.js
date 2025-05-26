/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
let longestPalindrome = function (s) {
  let n = s.length;
  const table = Array(n)
    .fill(0)
    .map(() => Array(n).fill(false));
  let start = 0;
  let maxLen = 1;
  // 长度为1,从 i到i都是回文串
  for (let index = 0; index < n; index++) {
    table[index][index] = true;
  }
  // 可能整个字符串都是回文串
  for (let len = 2; len <= n; len++) {
    // 0123      4 -2
    for (let left = 0; left <= n - len; left++) {
      let right = left + len - 1;
      if (s[left] === s[right]) {
        // 长度为2  aa  没有边界可以检查,所以需要设置为true
        if (len === 2) {
          table[left][right] = true;
        } else {
          table[left][right] = table[left + 1][right - 1];
        }
      }
      if (table[left][right] && len > maxLen) {
        start = left;
        maxLen = len;
      }
    }
  }
  return s.substring(start, start + maxLen);
};
// @lc code=end

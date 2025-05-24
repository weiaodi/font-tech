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
  let maxlen = 1;
  let start = 0;
  let tables = new Array(n).fill(0).map(() => new Array(n).fill(false));
  // 长度为1 即xy相等->第i个到第i个 均为回文串
  for (let index = 0; index < n; index++) {
    tables[index][index] = true;
  }
  // 长度
  for (let len = 2; len <= n; len++) {
    // 长度为2 0-1
    for (let left = 0; left <= n - len; left++) {
      // 以长度为2,在字符串内部遍历结果
      let right = left + len - 1;
      if (s[left] === s[right]) {
        if (len === 2) {
          tables[left][right] = true;
        } else {
          tables[left][right] = tables[left + 1][right - 1];
        }
      }
      if (tables[left][right] && len > maxlen) {
        start = left;
        maxlen = len;
      }
    }
  }
  // substring截取不含最后的元素
  return s.substring(start, start + maxlen);
};
// @lc code=end

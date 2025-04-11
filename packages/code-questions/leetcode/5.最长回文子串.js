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
  const n = s.length;
  let table = new Array(n).fill(0).map(() => new Array(n).fill(false));
  let maxLen = 1;
  let start = 0;
  //   为0的情况下全为回文字符串
  for (let i = 0; i < n; i++) {
    table[i][i] = true;
  }
  //   从长度为2开始执行
  for (let len = 2; len <= n; len++) {
    for (let left = 0; left <= n - len; left++) {
      let right = left + len - 1;
      //   判断当前字符是否相等
      if (s[left] === s[right]) {
        if (len === 2) {
          table[left][right] = true;
        } else {
          table[left][right] = table[left + 1][right - 1];
        }
      }
      //   判断是否为回文字符串
      if (table[left][right] && len > maxLen) {
        maxLen = len;
        start = left;
      }
    }
  }

  return s.substring(start, start + maxLen);
};
// @lc code=end

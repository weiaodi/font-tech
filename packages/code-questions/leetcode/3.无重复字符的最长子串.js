/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
let lengthOfLongestSubstring = function (s) {
  let window = {};
  let maxLen = 0;
  for (let l = 0, r = 0; r < s.length; r++) {
    if (window[s[r]] !== undefined && window[s[r]] >= l) {
      l = window[s[r]] + 1;
    }
    window[s[r]] = r;
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
};
// @lc code=end

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
  let h = {};
  let maxLen = 0;
  for (let l = 0, r = 0; r < s.length; r++) {
    if (h[s[r]] !== undefined && h[s[r]] >= l) {
      l = h[s[r]] + 1;
    }
    h[s[r]] = r;
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
};
// @lc code=end

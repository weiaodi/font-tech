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
      // 代表有重复的元素且重复的元素在 l-r区间
      // 移动该元素到最近出现位置的下一个位置
      l = window[s[r]] + 1;
    }
    window[s[r]] = r;
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
};
// @lc code=end

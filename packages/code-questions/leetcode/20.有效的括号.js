/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
let isValid = function (s) {
  let stack = [];
  let mapping = {
    '[': ']',
    '(': ')',
    '{': '}',
  };
  for (let i = 0; i < s.length; i++) {
    if (mapping[s[i]]) {
      stack.push(s[i]);
    } else {
      if (!stack.length) {
        return false;
      }
      if (mapping[stack.pop()] !== s[i]) {
        return false;
      }
    }
  }
  return stack.length === 0;
};
// @lc code=end

/*
 * @lc app=leetcode.cn id=14 lang=javascript
 *
 * [14] 最长公共前缀
 */

// @lc code=start
/**
 * @param {string[]} strs
 * @return {string}
 */
let longestCommonPrefix = function (strs) {
  let pre = '';
  for (let preIndex = 0; preIndex < strs[0].length; preIndex++) {
    let curChar = strs[0][preIndex];
    // 判断所有元素是否含有当前的前缀元素
    for (let i = 0; i < strs.length; i++) {
      if (strs[i][preIndex] !== curChar) {
        return pre;
      }
      if (strs[i][preIndex] === curChar && i === strs.length - 1) {
        pre += curChar;
      }
    }
  }
  return pre;
};
// @lc code=end

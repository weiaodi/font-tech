/*
 * @lc app=leetcode.cn id=6 lang=javascript
 *
 * [6] Z 字形变换
 */

// @lc code=start
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
let convert = function (s, numRows) {
  /* 
  PAYPALISHIRING
P   A   H   N
A P L S I I G
Y   I   R
只关注每一行放什么元素,简化问题
*/
  if (s.length < numRows || numRows === 1) {
    return s;
  }
  let curRow = 0;
  let rows = new Array(numRows).fill('');
  let down = false;
  for (const char of s) {
    rows[curRow] += char;
    if (curRow === 0 || curRow === numRows - 1) {
      down = !down;
    }
    curRow += down ? 1 : -1;
  }
  return rows.join('');
};
// @lc code=end

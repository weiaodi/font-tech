/*
 * @lc app=leetcode.cn id=54 lang=javascript
 *
 * [54] 螺旋矩阵
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
let spiralOrder = function (matrix) {
  if (matrix.length === 0 || matrix[0].length === 0) {
    return [];
  }

  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  let res = [];

  const Direction = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3,
  };

  let currentDirection = Direction.RIGHT;
  // 收缩边界或者通过哈希表来确认是否访问过当前元素
  while (top <= bottom && left <= right) {
    if (currentDirection === Direction.RIGHT) {
      for (let i = left; i <= right; i++) {
        res.push(matrix[top][i]);
      }
      top++; // 上边界下移
    } else if (currentDirection === Direction.DOWN) {
      for (let i = top; i <= bottom; i++) {
        res.push(matrix[i][right]);
      }
      right--; // 右边界左移
    } else if (currentDirection === Direction.LEFT) {
      for (let i = right; i >= left; i--) {
        res.push(matrix[bottom][i]);
      }
      bottom--; // 下边界上移
    } else if (currentDirection === Direction.UP) {
      for (let i = bottom; i >= top; i--) {
        res.push(matrix[i][left]);
      }
      left++; // 左边界右移
    }

    // 循环切换方向
    currentDirection = (currentDirection + 1) % 4;
  }

  return res;
};
// @lc code=end
